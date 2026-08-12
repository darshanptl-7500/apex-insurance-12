using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using ApexInsurance.Api.Filters;
using ApexInsurance.Data;
using ApexInsurance.Data.OpenBox;
using ApexInsurance.Domain.Entities;
using ApexInsurance.Services.Support;
using ApexInsurance.Services.Workbench;

namespace ApexInsurance.Api.Controllers
{
    [Route("api/support")]
    [AuthorizeRole]
    [ApiController]
    public class SupportController : ApexApiControllerBase
    {
        private readonly ISupportHealthService _healthService;
        private readonly IUnitOfWork _unitOfWork;

        public SupportController(ISupportHealthService healthService, IUnitOfWork unitOfWork)
        {
            _healthService = healthService;
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        [Route("health")]
        public IActionResult Health()
        {
            return Ok(_healthService.RunChecks());
        }

        [HttpGet]
        [Route("integration-activity")]
        public IActionResult IntegrationActivity(int take = 50)
        {
            EnsureSeedJobs();
            var items = _unitOfWork.IntegrationActivities.Query()
                .OrderByDescending(a => a.OccurredUtc)
                .Take(System.Math.Clamp(take, 1, 200))
                .ToList();
            return Ok(items);
        }

        [HttpGet]
        [Route("scheduled-jobs")]
        public IActionResult ScheduledJobs()
        {
            EnsureSeedJobs();
            return Ok(_unitOfWork.ScheduledJobs.Query().OrderBy(j => j.JobName).ToList());
        }

        private void EnsureSeedJobs()
        {
            try
            {
                if (_unitOfWork.ScheduledJobs.Count() > 0) return;
                var seeds = new[]
                {
                    new ScheduledJob { JobName = "Premium Schedule Sync", ScheduleType = "Daily @ 10:00 pm", RagStatus = "Pass", JobStatus = "Idle", IsActive = true, LastRunUtc = System.DateTime.UtcNow.AddHours(-4) },
                    new ScheduledJob { JobName = "Final Slip Tasks Creator", ScheduleType = "Daily @ 10:30 pm", RagStatus = "Pass", JobStatus = "Idle", IsActive = true, LastRunUtc = System.DateTime.UtcNow.AddHours(-3) },
                    new ScheduledJob { JobName = "Policy State Translate", ScheduleType = "Daily @ 11:00 pm", RagStatus = "Pass", JobStatus = "Idle", IsActive = true, LastRunUtc = System.DateTime.UtcNow.AddHours(-2) },
                    new ScheduledJob { JobName = "Document Deletion / Search", ScheduleType = "Weekly Mon @ 2:00 am", RagStatus = "Must Run", JobStatus = "Idle", IsActive = true, LastRunUtc = System.DateTime.UtcNow.AddDays(-6) },
                    new ScheduledJob { JobName = "Bucket Cleanup", ScheduleType = "Monthly 27th @ 10:00 pm", RagStatus = "Pass", JobStatus = "Idle", IsActive = true, LastRunUtc = System.DateTime.UtcNow.AddDays(-20) }
                };
                foreach (var j in seeds) _unitOfWork.ScheduledJobs.Add(j);
                _unitOfWork.SaveChanges();
            }
            catch
            {
                // Table may not exist until 04_MarketFields.sql is applied.
            }
        }
    }

    [Route("api/underwriter-file")]
    [AuthorizeRole]
    [ApiController]
    public class UnderwriterFileController : ApexApiControllerBase
    {
        private readonly IUnderwriterFileService _underwriterFileService;
        private readonly IOpenBoxGateway _openBox;

        public UnderwriterFileController(IUnderwriterFileService underwriterFileService, IOpenBoxGateway openBox)
        {
            _underwriterFileService = underwriterFileService;
            _openBox = openBox;
        }

        [HttpGet]
        [Route("{submissionId:int}")]
        public IActionResult Get(int submissionId)
        {
            var file = _underwriterFileService.GetBySubmissionId(submissionId);
            if (file == null)
            {
                return NotFound();
            }

            return Ok(file);
        }

        /// <summary>POST allowed UW edit fields through Open Box write path (FR-07).</summary>
        [HttpPost]
        [Route("{submissionId:int}/edit")]
        public IActionResult Edit(int submissionId, [FromBody] OpenBoxUwEditRequest request)
        {
            if (request == null)
            {
                return BadRequest("Request body is required.");
            }

            _openBox.UpdateUnderwritingFields(submissionId, request);
            var file = _underwriterFileService.GetBySubmissionId(submissionId);
            if (file == null)
            {
                return NotFound();
            }

            return Ok(file);
        }
    }
}
