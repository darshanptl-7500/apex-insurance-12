using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using ApexInsurance.Data;
using ApexInsurance.Domain.Entities;
using ApexInsurance.Domain.Enums;
using ApexInsurance.Services.Audit;
using ApexInsurance.Services.Dto;

namespace ApexInsurance.Services.Documents
{
    public class DocumentService : IDocumentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAuditService _auditService;
        private readonly string _storageRoot;

        public DocumentService(IUnitOfWork unitOfWork, IAuditService auditService, string storageRoot = null)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _auditService = auditService ?? throw new ArgumentNullException(nameof(auditService));

            _storageRoot = string.IsNullOrWhiteSpace(storageRoot)
                ? Path.Combine(AppContext.BaseDirectory, "App_Data", "Documents")
                : storageRoot;

            Directory.CreateDirectory(_storageRoot);
        }

        public DocumentDto SaveDocument(SaveDocumentRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));
            if (request.Content == null) throw new ArgumentException("Document content stream is required.", nameof(request));

            var extension = Path.GetExtension(request.FileName);
            var storedFileName = $"{Guid.NewGuid():N}{extension}";
            var fullPath = Path.Combine(_storageRoot, storedFileName);

            long size;
            using (var fileStream = File.Create(fullPath))
            {
                request.Content.Position = 0;
                request.Content.CopyTo(fileStream);
                size = fileStream.Length;
            }

            var document = new Document
            {
                FileName = request.FileName,
                StoredFileName = storedFileName,
                StoragePath = fullPath,
                ContentType = request.ContentType,
                FileSizeBytes = size,
                DocumentType = request.DocumentType,
                SubmissionId = request.SubmissionId,
                PolicyId = request.PolicyId,
                ClaimId = request.ClaimId,
                UploadedByUserId = request.UploadedByUserId,
                UploadedDate = DateTime.UtcNow,
                VersionNumber = 1,
                IsLatestVersion = true,
                Notes = request.Notes
            };

            _unitOfWork.Documents.Add(document);
            _unitOfWork.SaveChanges();

            _auditService.WriteAudit("Document", document.Id, "Uploaded", request.UploadedByUserId);

            return MapToDto(document);
        }

        public DocumentDto AddNewVersion(int existingDocumentId, SaveDocumentRequest request)
        {
            var existing = _unitOfWork.Documents.GetById(existingDocumentId);
            if (existing == null) throw new InvalidOperationException($"Document {existingDocumentId} not found.");

            var rootId = existing.ParentDocumentId ?? existing.Id;
            var latest = _unitOfWork.Documents.GetLatestVersion(existingDocumentId) ?? existing;

            latest.IsLatestVersion = false;
            _unitOfWork.Documents.Update(latest);

            var newDoc = SaveDocument(request);
            var newEntity = _unitOfWork.Documents.GetById(newDoc.Id);
            newEntity.ParentDocumentId = rootId;
            newEntity.VersionNumber = latest.VersionNumber + 1;
            newEntity.IsLatestVersion = true;

            _unitOfWork.Documents.Update(newEntity);
            _unitOfWork.SaveChanges();

            return MapToDto(newEntity);
        }

        public DocumentDto Classify(int documentId, DocumentType documentType)
        {
            var document = GetOrThrow(documentId);
            document.DocumentType = documentType;

            _unitOfWork.Documents.Update(document);
            _unitOfWork.SaveChanges();

            return MapToDto(document);
        }

        public DocumentDto Annotate(int documentId, string notes)
        {
            var document = GetOrThrow(documentId);
            document.Notes = notes;

            _unitOfWork.Documents.Update(document);
            _unitOfWork.SaveChanges();

            return MapToDto(document);
        }

        public void LogAccess(int documentId, int userId, string accessType)
        {
            _auditService.WriteDocumentAccess(documentId, userId, accessType);
        }

        public DocumentDto GetById(int documentId)
        {
            var document = _unitOfWork.Documents.GetById(documentId);
            return document == null ? null : MapToDto(document);
        }

        public IEnumerable<DocumentDto> List(int? submissionId = null, int? policyId = null, int? claimId = null)
        {
            return _unitOfWork.Documents.Search(submissionId, policyId, claimId, latestOnly: true)
                .Select(MapToDto)
                .ToList();
        }

        public IEnumerable<DocumentDto> GetForSubmission(int submissionId)
        {
            return _unitOfWork.Documents.GetBySubmission(submissionId).Select(MapToDto).ToList();
        }

        public IEnumerable<DocumentDto> GetForPolicy(int policyId)
        {
            return _unitOfWork.Documents.GetByPolicy(policyId).Select(MapToDto).ToList();
        }

        public IEnumerable<DocumentDto> GetForClaim(int claimId)
        {
            return _unitOfWork.Documents.GetByClaim(claimId).Select(MapToDto).ToList();
        }

        public IEnumerable<DocumentDto> GetVersionHistory(int documentId)
        {
            return _unitOfWork.Documents.GetVersionHistory(documentId).Select(MapToDto).ToList();
        }

        public byte[] ReadContent(int documentId)
        {
            var document = GetOrThrow(documentId);
            return File.Exists(document.StoragePath) ? File.ReadAllBytes(document.StoragePath) : null;
        }

        private Document GetOrThrow(int documentId)
        {
            var document = _unitOfWork.Documents.GetById(documentId);
            if (document == null) throw new InvalidOperationException($"Document {documentId} not found.");
            return document;
        }

        private static DocumentDto MapToDto(Document document)
        {
            return new DocumentDto
            {
                Id = document.Id,
                FileName = document.FileName,
                ContentType = document.ContentType,
                FileSizeBytes = document.FileSizeBytes,
                DocumentType = document.DocumentType,
                SubmissionId = document.SubmissionId,
                PolicyId = document.PolicyId,
                ClaimId = document.ClaimId,
                UploadedByUserId = document.UploadedByUserId,
                UploadedDate = document.UploadedDate,
                VersionNumber = document.VersionNumber,
                IsLatestVersion = document.IsLatestVersion,
                Notes = document.Notes,
                StoragePath = document.StoragePath
            };
        }
    }
}
