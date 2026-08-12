using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using ApexInsurance.Api.Filters;
using ApexInsurance.Api.Infrastructure;
using ApexInsurance.Api.Models.Documents;
using ApexInsurance.Domain.Enums;
using ApexInsurance.Services.Documents;
using ApexInsurance.Services.Dto;
using ApexInsurance.Services.Workflow;

namespace ApexInsurance.Api.Controllers
{
    [Route("api/documents")]
    [ApiController]
    [AuthorizeRole]
    public class DocumentsController : ApexApiControllerBase
    {
        private readonly IDocumentService _documentService;
        private readonly IConfiguration _configuration;
        private readonly IWorkflowService _workflowService;

        public DocumentsController(IDocumentService documentService, IConfiguration configuration, IWorkflowService workflowService)
        {
            _documentService = documentService;
            _configuration = configuration;
            _workflowService = workflowService;
        }

        [HttpGet]
        public IActionResult List(int? submissionId = null, int? policyId = null, int? claimId = null)
        {
            var items = _documentService.List(submissionId, policyId, claimId).ToList();
            return Ok(new { items, totalCount = items.Count });
        }

        [HttpGet("{id:int}")]
        public IActionResult Get(int id)
        {
            var document = _documentService.GetById(id);
            if (document == null)
            {
                return NotFound();
            }

            _documentService.LogAccess(id, CurrentUserId, "View");
            return Ok(document);
        }

        [HttpGet("by-submission/{submissionId:int}")]
        public IActionResult ListForSubmission(int submissionId)
        {
            return Ok(_documentService.GetForSubmission(submissionId).ToList());
        }

        [HttpGet("by-policy/{policyId:int}")]
        public IActionResult ListForPolicy(int policyId)
        {
            return Ok(_documentService.GetForPolicy(policyId).ToList());
        }

        [HttpGet("by-claim/{claimId:int}")]
        public IActionResult ListForClaim(int claimId)
        {
            return Ok(_documentService.GetForClaim(claimId).ToList());
        }

        [HttpGet("{id:int}/versions")]
        public IActionResult VersionHistory(int id)
        {
            return Ok(_documentService.GetVersionHistory(id).ToList());
        }

        [HttpPost("upload")]
        [RequestSizeLimit(26214400)]
        public async Task<IActionResult> Upload()
        {
            var (request, tempFilePath, spawnTasks) = await ReadUploadAsync();
            try
            {
                DocumentDto saved;
                using (request.Content)
                {
                    saved = _documentService.SaveDocument(request);
                }

                SpawnWorkflowTasks(saved, spawnTasks);
                return Created($"api/documents/{saved.Id}", saved);
            }
            finally
            {
                TryDeleteTempFile(tempFilePath);
            }
        }

        [HttpPost("{id:int}/versions")]
        [RequestSizeLimit(26214400)]
        public async Task<IActionResult> UploadNewVersion(int id)
        {
            var (request, tempFilePath, _) = await ReadUploadAsync();
            try
            {
                DocumentDto saved;
                using (request.Content)
                {
                    saved = _documentService.AddNewVersion(id, request);
                }
                return Ok(saved);
            }
            finally
            {
                TryDeleteTempFile(tempFilePath);
            }
        }

        [HttpPut("{id:int}/classify")]
        public IActionResult Classify(int id, DocumentClassifyRequestViewModel request)
        {
            if (request == null || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var docType = EnumHelper.Parse<DocumentType>(request.DocumentType, "document type");
            return Ok(_documentService.Classify(id, docType));
        }

        [HttpPut("{id:int}/annotate")]
        public IActionResult Annotate(int id, DocumentAnnotateRequestViewModel request)
        {
            var updated = _documentService.Annotate(id, request?.Notes);
            return Ok(updated);
        }

        [HttpGet("{id:int}/download")]
        public IActionResult Download(int id)
        {
            var document = _documentService.GetById(id);
            if (document == null)
            {
                return NotFound();
            }

            var bytes = _documentService.ReadContent(id);
            if (bytes == null)
            {
                return NotFound();
            }

            _documentService.LogAccess(id, CurrentUserId, "Download");

            var contentType = string.IsNullOrWhiteSpace(document.ContentType)
                ? "application/octet-stream"
                : document.ContentType;

            return File(bytes, contentType, SanitizeDownloadFileName(document.FileName));
        }

        /// <summary>
        /// Normalise Unicode spaces / invalid path chars so Content-Disposition stays portable.
        /// </summary>
        private static string SanitizeDownloadFileName(string fileName)
        {
            if (string.IsNullOrWhiteSpace(fileName))
            {
                return "document.bin";
            }

            var cleaned = fileName
                .Replace('\u202F', ' ')  // narrow no-break space (common in macOS screenshots)
                .Replace('\u00A0', ' ')
                .Replace('\u2007', ' ');

            foreach (var c in Path.GetInvalidFileNameChars())
            {
                cleaned = cleaned.Replace(c, '_');
            }

            return cleaned.Trim();
        }

        private void SpawnWorkflowTasks(DocumentDto saved, IList<string> spawnTasks)
        {
            if (saved == null || spawnTasks == null || spawnTasks.Count == 0)
            {
                return;
            }

            var assignee = CurrentUserId > 0 ? CurrentUserId : 1;
            foreach (var type in spawnTasks.Where(t => !string.IsNullOrWhiteSpace(t)).Distinct(StringComparer.OrdinalIgnoreCase))
            {
                _workflowService.CreateTask(new CreateTaskRequest
                {
                    Title = type.Trim(),
                    Description = "Spawned from document upload: " + saved.FileName,
                    SubmissionId = saved.SubmissionId,
                    ClaimId = saved.ClaimId,
                    DocumentId = saved.Id,
                    AssignedToUserId = assignee,
                    CreatedByUserId = CurrentUserId,
                    DueDate = DateTime.UtcNow.AddDays(5),
                    Priority = "Normal",
                    TaskType = type.Trim()
                });
            }
        }

        private async Task<(SaveDocumentRequest Request, string TempFilePath, IList<string> SpawnTasks)> ReadUploadAsync()
        {
            if (!Request.HasFormContentType)
            {
                throw new ApexValidationException("Expected multipart/form-data content for a file upload.");
            }

            var form = await Request.ReadFormAsync();
            var file = form.Files.FirstOrDefault();
            if (file == null || file.Length == 0)
            {
                throw new ApexValidationException("No file part was found in the upload request.");
            }

            var originalFileName = file.FileName ?? "upload.bin";
            var contentType = string.IsNullOrWhiteSpace(file.ContentType)
                ? "application/octet-stream"
                : file.ContentType;

            var tempPath = Path.Combine(Path.GetTempPath(), "apex-uploads");
            Directory.CreateDirectory(tempPath);
            var tempFilePath = Path.Combine(tempPath, $"{Guid.NewGuid():N}{Path.GetExtension(originalFileName)}");

            await using (var stream = System.IO.File.Create(tempFilePath))
            {
                await file.CopyToAsync(stream);
            }

            ValidateUpload(originalFileName, tempFilePath);

            var docType = EnumHelper.TryParseOrNull<DocumentType>(form["documentType"]) ?? DocumentType.Other;
            var submissionId = ParseNullableInt(form["submissionId"]);
            var policyId = ParseNullableInt(form["policyId"]);
            var claimId = ParseNullableInt(form["claimId"]);
            var author = form["author"].ToString();
            var endtNo = form["endorsementNo"].ToString();
            var displayName = form["displayName"].ToString();
            var externalRef = form["externalReference"].ToString();
            var notes = form["notes"].ToString();
            var spawnCsv = form["spawnTasks"].ToString();
            var spawnTasks = (spawnCsv ?? string.Empty)
                .Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries)
                .Select(s => s.Trim())
                .Where(s => s.Length > 0)
                .ToList();

            var metaNotes = "META|author=" + (author ?? "")
                + "|endt=" + (endtNo ?? "")
                + "|name=" + (displayName ?? "")
                + "|ref=" + (externalRef ?? "")
                + "|notes=" + (notes ?? "");

            var content = System.IO.File.OpenRead(tempFilePath);

            var request = new SaveDocumentRequest
            {
                FileName = originalFileName,
                ContentType = contentType,
                Content = content,
                DocumentType = docType,
                SubmissionId = submissionId,
                PolicyId = policyId,
                ClaimId = claimId,
                UploadedByUserId = CurrentUserId,
                Notes = metaNotes
            };

            return (request, tempFilePath, spawnTasks);
        }

        private void ValidateUpload(string fileName, string localFileName)
        {
            var maxBytes = long.TryParse(_configuration["Apex:Documents:MaxUploadSizeBytes"], out var configuredMax)
                ? configuredMax
                : 26214400L;

            var allowedExtensions = (_configuration["Apex:Documents:AllowedExtensions"] ?? string.Empty)
                .Split(',')
                .Select(e => e.Trim().ToLowerInvariant())
                .Where(e => e.Length > 0)
                .ToList();

            var extension = Path.GetExtension(fileName)?.ToLowerInvariant();
            if (allowedExtensions.Count > 0 && !allowedExtensions.Contains(extension))
            {
                throw new ApexValidationException(
                    $"File type '{extension}' is not allowed. Allowed types: {string.Join(", ", allowedExtensions)}.");
            }

            var fileInfo = new FileInfo(localFileName);
            if (fileInfo.Exists && fileInfo.Length > maxBytes)
            {
                throw new ApexValidationException(
                    $"File exceeds the maximum allowed upload size of {maxBytes / 1024 / 1024} MB.");
            }
        }

        private static int? ParseNullableInt(string value)
        {
            return int.TryParse(value, out var parsed) ? parsed : (int?)null;
        }

        private static void TryDeleteTempFile(string path)
        {
            try
            {
                if (!string.IsNullOrEmpty(path) && System.IO.File.Exists(path))
                {
                    System.IO.File.Delete(path);
                }
            }
            catch (IOException)
            {
            }
        }
    }
}
