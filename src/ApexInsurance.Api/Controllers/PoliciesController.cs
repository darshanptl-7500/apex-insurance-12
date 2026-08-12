using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApexInsurance.Api.Filters;
using ApexInsurance.Api.Infrastructure;
using ApexInsurance.Api.Models.Common;
using ApexInsurance.Data;
using ApexInsurance.Domain.Entities;
using ApexInsurance.Domain.Enums;
using ApexInsurance.Services.Dto;
using ApexInsurance.Services.Policies;

namespace ApexInsurance.Api.Controllers
{
    [Route("api/policies")]
    [AuthorizeRole]
    [ApiController]
    public class PoliciesController : ApexApiControllerBase
    {
        private readonly IPolicyService _policyService;
        private readonly IUnitOfWork _unitOfWork;

        public PoliciesController(IPolicyService policyService, IUnitOfWork unitOfWork)
        {
            _policyService = policyService;
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// GET api/policies?brokerId=&amp;status=&amp;lineOfBusiness=&amp;search=&amp;page=&amp;pageSize=
        /// No generic filtered-list method exists on IPolicyService, so this reads
        /// IUnitOfWork.Policies directly and maps onto the same PolicyDto shape IPolicyService uses.
        /// </summary>
        [HttpGet]
        [Route("")]
        public IActionResult List(
            int? brokerId = null,
            string status = null,
            string lineOfBusiness = null,
            string search = null,
            int page = 1,
            int pageSize = 25)
        {
            var statusFilter = EnumHelper.TryParseOrNull<PolicyStatus>(status);
            var lobFilter = EnumHelper.TryParseOrNull<LineOfBusiness>(lineOfBusiness);

            var query = _unitOfWork.Policies.Query();

            if (brokerId.HasValue) query = query.Where(p => p.BrokerId == brokerId.Value);
            if (statusFilter.HasValue) query = query.Where(p => p.Status == statusFilter.Value);
            if (lobFilter.HasValue) query = query.Where(p => p.LineOfBusiness == lobFilter.Value);
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(p => p.PolicyNumber.Contains(search) || p.Insured.Name.Contains(search));
            }

            var totalCount = query.Count();
            var items = query
                .Include(p => p.Broker)
                .Include(p => p.Insured)
                .Include(p => p.Submission).ThenInclude(s => s.Underwriter)
                .OrderByDescending(p => p.BoundDate)
                .Skip((Math.Max(page, 1) - 1) * pageSize)
                .Take(pageSize)
                .ToList()
                .Select(ToDto)
                .ToList();

            return Ok(new PagedResultViewModel<PolicyDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            });
        }

        /// <summary>GET api/policies/renewal-diary?daysAhead= - policies expiring within the window, for the renewals queue.</summary>
        [HttpGet]
        [Route("renewal-diary")]
        public IActionResult RenewalDiary(int daysAhead = 60)
        {
            return Ok(_policyService.GetRenewalDiary(daysAhead).ToList());
        }

        [HttpGet]
        [Route("{id:int}")]
        public IActionResult Get(int id)
        {
            var policy = _policyService.GetById(id);
            if (policy == null)
            {
                return NotFound();
            }

            return Ok(policy);
        }

        [HttpGet]
        [Route("by-number/{policyNumber}")]
        public IActionResult GetByPolicyNumber(string policyNumber)
        {
            var policy = _policyService.GetByPolicyNumber(policyNumber);
            if (policy == null)
            {
                return NotFound();
            }

            return Ok(policy);
        }

        /// <summary>POST api/policies/bind - converts a selected quote into a bound policy.</summary>
        [HttpPost]
        [Route("bind")]
        public IActionResult Bind(BindQuoteRequest request)
        {
            if (request == null)
            {
                return BadRequest("Request body is required.");
            }

            request.BoundByUserId = CurrentUserId;
            var policy = _policyService.BindQuote(request);
            return Created($"api/policies/{policy.Id}", policy);
        }

        [HttpPost]
        [Route("{id:int}/endorsements")]
        public IActionResult Endorse(int id, EndorsePolicyRequest request)
        {
            if (request == null)
            {
                return BadRequest("Request body is required.");
            }

            request.PolicyId = id;
            request.CreatedByUserId = CurrentUserId;

            var updated = _policyService.Endorse(request);
            return Ok(updated);
        }

        [HttpPost]
        [Route("{id:int}/cancel")]
        public IActionResult Cancel(int id, CancelPolicyRequest request)
        {
            if (request == null)
            {
                return BadRequest("Request body is required.");
            }

            request.PolicyId = id;
            request.CancelledByUserId = CurrentUserId;

            var updated = _policyService.Cancel(request);
            return Ok(updated);
        }

        [HttpPost]
        [Route("{id:int}/reinstate")]
        public IActionResult Reinstate(int id)
        {
            var updated = _policyService.Reinstate(id);
            return Ok(updated);
        }

        /// <summary>POST api/policies/{id}/create-renewal - spins up a new renewal Submission from an expiring policy; returns the new submission id.</summary>
        [HttpPost]
        [Route("{id:int}/create-renewal")]
        public IActionResult CreateRenewal(int id)
        {
            var submissionId = _policyService.CreateRenewalSubmission(id, CurrentUserId);
            return Created($"api/submissions/{submissionId}", new { submissionId });
        }

        private static PolicyDto ToDto(Policy p)
        {
            // List endpoint: related collections are not loaded — return empty lists.
            return new PolicyDto
            {
                Id = p.Id,
                PolicyNumber = p.PolicyNumber,
                SubmissionId = p.SubmissionId,
                BrokerId = p.BrokerId,
                BrokerName = p.Broker?.Name,
                BrokerContact = p.Broker?.ContactEmail,
                InsuredId = p.InsuredId,
                InsuredName = p.Insured?.Name,
                UnderwriterName = p.Submission?.Underwriter?.FullName,
                LineOfBusiness = p.LineOfBusiness,
                Status = p.Status,
                EffectiveDate = p.EffectiveDate,
                ExpiryDate = p.ExpiryDate,
                GrossPremium = p.GrossPremium,
                NetPremium = p.NetPremium,
                SumInsured = p.SumInsured,
                LimitOfIndemnity = p.LimitOfIndemnity,
                Deductible = p.Deductible,
                BoundDate = p.BoundDate,
                CancelledDate = p.CancelledDate,
                CancellationReason = p.CancellationReason
            };
        }
    }
}
