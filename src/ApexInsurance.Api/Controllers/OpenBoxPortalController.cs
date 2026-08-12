using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApexInsurance.Api.Filters;
using ApexInsurance.Data;
using ApexInsurance.Data.OpenBox;

namespace ApexInsurance.Api.Controllers
{
    /// <summary>
    /// Lab Open Box portal API — PAS-style risk list backed by the local OBX mirror + bus.
    /// </summary>
    [Route("api/openbox")]
    [AuthorizeRole]
    [ApiController]
    public class OpenBoxPortalController : ApexApiControllerBase
    {
        private readonly IOpenBoxGateway _openBox;
        private readonly IOpenBoxIntegrationBus _bus;
        private readonly IUnitOfWork _unitOfWork;

        public OpenBoxPortalController(IOpenBoxGateway openBox, IOpenBoxIntegrationBus bus, IUnitOfWork unitOfWork)
        {
            _openBox = openBox;
            _bus = bus;
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        [Route("status")]
        public IActionResult Status()
        {
            var health = _bus.Probe();
            return Ok(new
            {
                gateway = _openBox.Name,
                gatewayAvailable = _openBox.IsAvailable(),
                policyCount = _openBox.PolicyCount(),
                riskCount = _openBox.ListRisks(500).Count,
                bus = health
            });
        }

        [HttpGet]
        [Route("risks")]
        public IActionResult Risks(int take = 100, string search = null)
        {
            var risks = _openBox.ListRisks(take);
            var submissionIds = risks.Select(r => r.SubmissionId).Distinct().ToList();
            var submissions = _unitOfWork.Submissions.Query()
                .Include(s => s.Insured)
                .Include(s => s.Broker)
                .Where(s => submissionIds.Contains(s.Id))
                .ToList()
                .ToDictionary(s => s.Id);

            var rows = risks.Select(r =>
            {
                submissions.TryGetValue(r.SubmissionId, out var s);
                return new
                {
                    r.SubmissionId,
                    r.UwReference,
                    r.Yoa,
                    r.Umr,
                    r.Mop,
                    r.PolicyType,
                    r.PolicyDescription,
                    r.BusinessArea,
                    r.NewOrRenewal,
                    r.IsDelegatedAuthority,
                    r.IsNonRenewable,
                    r.PrincipalUw,
                    r.PremRate,
                    r.TechnicalIndex,
                    r.ModelledLr,
                    r.LastTouchedUtc,
                    AccountName = s?.Insured?.Name,
                    BrokerName = s?.Broker?.Name,
                    Status = s?.Status.ToString(),
                    Inception = s?.RequestedEffectiveDate
                };
            });

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim().ToLowerInvariant();
                rows = rows.Where(r =>
                    (r.UwReference ?? "").ToLowerInvariant().Contains(term)
                    || (r.AccountName ?? "").ToLowerInvariant().Contains(term)
                    || (r.Umr ?? "").ToLowerInvariant().Contains(term)
                    || (r.BrokerName ?? "").ToLowerInvariant().Contains(term));
            }

            return Ok(rows.ToList());
        }

        [HttpGet]
        [Route("risks/{submissionId:int}")]
        public IActionResult Risk(int submissionId)
        {
            var detail = _openBox.GetMarketDetail(submissionId);
            if (detail == null) return NotFound();
            return Ok(detail);
        }

        [HttpGet]
        [Route("bus")]
        public IActionResult Bus()
        {
            return Ok(_bus.Probe());
        }

        [HttpGet]
        [Route("bus/messages")]
        public IActionResult BusMessages(int take = 50)
        {
            return Ok(_bus.Recent(take));
        }
    }
}
