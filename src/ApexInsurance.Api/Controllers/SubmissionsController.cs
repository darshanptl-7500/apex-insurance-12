using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApexInsurance.Api.Filters;
using ApexInsurance.Api.Infrastructure;
using ApexInsurance.Api.Models.Common;
using ApexInsurance.Api.Models.Submissions;
using ApexInsurance.Data.OpenBox;
using ApexInsurance.Data;
using ApexInsurance.Domain.Entities;
using ApexInsurance.Domain.Enums;
using ApexInsurance.Services.Workflow;

namespace ApexInsurance.Api.Controllers
{
    /// <summary>
    /// No dedicated ApexInsurance.Services.Submissions.ISubmissionService exists in this build,
    /// so this controller composes ApexInsurance.Data.IUnitOfWork.Submissions (+ RiskAnswers)
    /// directly for CRUD/list/risk-answers, and delegates assignment to
    /// <see cref="IWorkflowService.AssignSubmission"/> since that already owns the
    /// notify-the-underwriter side effect.
    /// </summary>
    [Route("api/submissions")]
    [AuthorizeRole]
    [ApiController]
    public class SubmissionsController : ApexApiControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IWorkflowService _workflowService;
        private readonly IOpenBoxGateway _openBox;

        public SubmissionsController(IUnitOfWork unitOfWork, IWorkflowService workflowService, IOpenBoxGateway openBox)
        {
            _unitOfWork = unitOfWork;
            _workflowService = workflowService;
            _openBox = openBox;
        }

        [HttpGet]
        [Route("")]
        public IActionResult List(
            int? brokerId = null,
            int? underwriterId = null,
            string status = null,
            string lineOfBusiness = null,
            string search = null,
            int page = 1,
            int pageSize = 25)
        {
            var statusFilter = EnumHelper.TryParseOrNull<SubmissionStatus>(status);
            var lobFilter = EnumHelper.TryParseOrNull<LineOfBusiness>(lineOfBusiness);

            var query = _unitOfWork.Submissions.Query();

            if (brokerId.HasValue) query = query.Where(s => s.BrokerId == brokerId.Value);
            if (underwriterId.HasValue) query = query.Where(s => s.UnderwriterUserId == underwriterId.Value);
            if (statusFilter.HasValue) query = query.Where(s => s.Status == statusFilter.Value);
            if (lobFilter.HasValue) query = query.Where(s => s.LineOfBusiness == lobFilter.Value);
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(s => s.SubmissionNumber.Contains(search) || s.Insured.Name.Contains(search));
            }

            var totalCount = query.Count();
            var items = query
                .Include(s => s.Broker)
                .Include(s => s.Insured)
                .Include(s => s.Underwriter)
                .OrderByDescending(s => s.ReceivedDate)
                .Skip((Math.Max(page, 1) - 1) * pageSize)
                .Take(pageSize)
                .ToList()
                .Select(ToListItemViewModel)
                .ToList();

            return Ok(new PagedResultViewModel<SubmissionListItemViewModel>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            });
        }

        [HttpGet]
        [Route("{id:int}")]
        public IActionResult Get(int id)
        {
            var submission = _unitOfWork.Submissions.GetWithDetails(id);
            if (submission == null)
            {
                return NotFound();
            }

            return Ok(ToDetailViewModel(submission));
        }

        [HttpPost]
        [Route("")]
        public IActionResult Create(SubmissionCreateRequestViewModel request)
        {
            if (request == null || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var submission = new Submission
            {
                SubmissionNumber = _unitOfWork.Submissions.GetNextSubmissionNumber(),
                BrokerId = request.BrokerId,
                InsuredId = request.InsuredId,
                LineOfBusiness = EnumHelper.Parse<LineOfBusiness>(request.LineOfBusiness, "line of business"),
                RequestedEffectiveDate = request.RequestedEffectiveDate,
                TargetPremium = request.TargetPremium,
                DueDate = request.DueDate,
                Notes = request.Notes,
                Status = SubmissionStatus.Received,
                ReceivedDate = DateTime.UtcNow
            };

            _unitOfWork.Submissions.Add(submission);
            _unitOfWork.SaveChanges();

            _openBox.CreateRisk(new OpenBoxCreateRiskRequest
            {
                SubmissionId = submission.Id,
                SubmissionNumber = submission.SubmissionNumber,
                Inception = submission.RequestedEffectiveDate,
                Expiry = request.ExpiryDate,
                BrokerContact = request.BrokerContact,
                PolicyType = request.PolicyType,
                Mop = request.Mop,
                PolicyDescription = request.PolicyDescription ?? request.Notes,
                RiskAppetite = request.RiskAppetite,
                BusinessArea = request.BusinessArea,
                NewOrRenewal = request.NewOrRenewal ?? "N",
                IsDelegatedAuthority = request.IsDelegatedAuthority,
                NotesType = "UWTR"
            });

            var detail = ToDetailViewModel(_unitOfWork.Submissions.GetWithDetails(submission.Id));
            return Created($"api/submissions/{submission.Id}", detail);
        }

        [HttpPut]
        [Route("{id:int}/status")]
        public IActionResult UpdateStatus(int id, SubmissionStatusUpdateRequestViewModel request)
        {
            if (request == null || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var submission = _unitOfWork.Submissions.GetById(id);
            if (submission == null)
            {
                return NotFound();
            }

            submission.Status = EnumHelper.Parse<SubmissionStatus>(request.Status, "submission status");
            _unitOfWork.Submissions.Update(submission);
            _unitOfWork.SaveChanges();

            return Ok(ToDetailViewModel(submission));
        }

        /// <summary>PUT api/submissions/{id}/assign - delegates to IWorkflowService.AssignSubmission, which also notifies the underwriter.</summary>
        [HttpPut]
        [Route("{id:int}/assign")]
        public IActionResult Assign(int id, SubmissionAssignRequestViewModel request)
        {
            if (request == null || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _workflowService.AssignSubmission(id, request.UnderwriterId, CurrentUserId);

            var updated = _unitOfWork.Submissions.GetWithDetails(id);
            return Ok(ToDetailViewModel(updated));
        }

        /// <summary>PUT api/submissions/{id}/due-date - update the underwriting due date after intake.</summary>
        [HttpPut]
        [Route("{id:int}/due-date")]
        public IActionResult UpdateDueDate(int id, SubmissionDueDateRequestViewModel request)
        {
            var submission = _unitOfWork.Submissions.GetById(id);
            if (submission == null)
            {
                return NotFound();
            }

            submission.DueDate = request?.DueDate;
            _unitOfWork.Submissions.Update(submission);
            _unitOfWork.SaveChanges();

            return Ok(ToDetailViewModel(_unitOfWork.Submissions.GetWithDetails(id)));
        }

        [HttpGet]
        [Route("{id:int}/risk-answers")]
        public IActionResult GetRiskAnswers(int id)
        {
            var answers = _unitOfWork.RiskAnswers.Find(r => r.SubmissionId == id);
            return Ok(answers.Select(ToRiskAnswerViewModel).ToList());
        }

        [HttpPut]
        [Route("{id:int}/risk-answers")]
        public IActionResult SaveRiskAnswers(int id, RiskAnswersRequestViewModel request)
        {
            if (request == null)
            {
                return BadRequest("Request body is required.");
            }

            var existing = _unitOfWork.RiskAnswers.Find(r => r.SubmissionId == id).ToList();
            foreach (var answer in existing)
            {
                _unitOfWork.RiskAnswers.Remove(answer);
            }

            var replacements = request.Answers.Select(a => new RiskAnswer
            {
                SubmissionId = id,
                QuestionCode = a.QuestionCode,
                QuestionText = a.QuestionText,
                AnswerText = a.AnswerText,
                AnswerNumeric = a.AnswerNumeric
            }).ToList();

            _unitOfWork.RiskAnswers.AddRange(replacements);
            _unitOfWork.SaveChanges();

            return Ok(replacements.Select(ToRiskAnswerViewModel).ToList());
        }

        private static SubmissionListItemViewModel ToListItemViewModel(Submission s)
        {
            return new SubmissionListItemViewModel
            {
                Id = s.Id,
                SubmissionNumber = s.SubmissionNumber,
                BrokerId = s.BrokerId,
                BrokerName = s.Broker?.Name,
                BrokerContact = s.Broker?.ContactEmail,
                InsuredId = s.InsuredId,
                InsuredName = s.Insured?.Name,
                LineOfBusiness = s.LineOfBusiness.ToString(),
                Status = s.Status.ToString(),
                TargetPremium = s.TargetPremium,
                RequestedEffectiveDate = s.RequestedEffectiveDate,
                ReceivedDate = s.ReceivedDate,
                UnderwriterUserId = s.UnderwriterUserId,
                UnderwriterName = s.Underwriter?.FullName,
                DueDate = s.DueDate,
                Notes = s.Notes
            };
        }

        private static SubmissionDetailViewModel ToDetailViewModel(Submission s)
        {
            return new SubmissionDetailViewModel
            {
                Id = s.Id,
                SubmissionNumber = s.SubmissionNumber,
                BrokerId = s.BrokerId,
                BrokerName = s.Broker?.Name,
                BrokerContact = s.Broker?.ContactEmail,
                InsuredId = s.InsuredId,
                InsuredName = s.Insured?.Name,
                LineOfBusiness = s.LineOfBusiness.ToString(),
                Status = s.Status.ToString(),
                TargetPremium = s.TargetPremium,
                RequestedEffectiveDate = s.RequestedEffectiveDate,
                ReceivedDate = s.ReceivedDate,
                UnderwriterUserId = s.UnderwriterUserId,
                UnderwriterName = s.Underwriter?.FullName,
                DueDate = s.DueDate,
                AssignedDate = s.AssignedDate,
                RenewedFromPolicyId = s.RenewedFromPolicyId,
                Notes = s.Notes,
                RiskAnswers = s.RiskAnswers?.Select(ToRiskAnswerViewModel).ToList() ?? new System.Collections.Generic.List<RiskAnswerViewModel>()
            };
        }

        private static RiskAnswerViewModel ToRiskAnswerViewModel(RiskAnswer a)
        {
            return new RiskAnswerViewModel
            {
                Id = a.Id,
                QuestionCode = a.QuestionCode,
                QuestionText = a.QuestionText,
                AnswerText = a.AnswerText,
                AnswerNumeric = a.AnswerNumeric
            };
        }
    }
}
