using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using ApexInsurance.Api.Filters;
using ApexInsurance.Api.Infrastructure;
using ApexInsurance.Api.Models.Claims;
using ApexInsurance.Data;
using ApexInsurance.Domain.Enums;
using ApexInsurance.Services.Claims;
using ApexInsurance.Services.Dto;

namespace ApexInsurance.Api.Controllers
{
    [Route("api/claims")]
    [AuthorizeRole]
    [ApiController]
    public class ClaimsController : ApexApiControllerBase
    {
        private readonly IClaimService _claimService;
        private readonly IUnitOfWork _unitOfWork;

        public ClaimsController(IClaimService claimService, IUnitOfWork unitOfWork)
        {
            _claimService = claimService;
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// GET api/claims?policyId=&amp;insuredId=&amp;brokerId=&amp;status=&amp;handlerUserId=
        /// Exactly one of policyId/insuredId/brokerId/handlerUserId should typically be supplied;
        /// with none supplied this returns open claims (IUnitOfWork.Claims.GetOpenClaims).
        /// </summary>
        [HttpGet]
        [Route("")]
        public IActionResult List(int? policyId = null, int? insuredId = null, int? brokerId = null, string status = null, int? handlerUserId = null)
        {
            IEnumerable<ClaimDto> claims;

            if (policyId.HasValue)
            {
                claims = _claimService.GetByPolicy(policyId.Value);
            }
            else if (insuredId.HasValue)
            {
                claims = _claimService.GetByInsured(insuredId.Value);
            }
            else if (brokerId.HasValue)
            {
                claims = _claimService.GetByBroker(brokerId.Value);
            }
            else if (handlerUserId.HasValue)
            {
                claims = _unitOfWork.Claims.GetByHandler(handlerUserId.Value).Select(MapEntityFallback);
            }
            else
            {
                var statusFilter = EnumHelper.TryParseOrNull<ClaimStatus>(status);
                claims = statusFilter.HasValue
                    ? _unitOfWork.Claims.GetByStatus(statusFilter.Value).Select(MapEntityFallback)
                    : _unitOfWork.Claims.GetOpenClaims().Select(MapEntityFallback);
            }

            return Ok(claims.ToList());
        }

        [HttpGet]
        [Route("{id:int}")]
        public IActionResult Get(int id)
        {
            var claim = _claimService.GetById(id);
            if (claim == null)
            {
                return NotFound();
            }

            return Ok(claim);
        }

        /// <summary>POST api/claims/fnol - First Notification Of Loss intake.</summary>
        [HttpPost]
        [Route("fnol")]
        public IActionResult CreateFnol(CreateFnolRequest request)
        {
            if (request == null)
            {
                return BadRequest("Request body is required.");
            }

            request.ReportedByUserId = CurrentUserId;
            var created = _claimService.CreateFnol(request);
            return Created($"api/claims/{created.Id}", created);
        }

        [HttpPut]
        [Route("{id:int}/status")]
        public IActionResult UpdateStatus(int id, ClaimStatusUpdateRequestViewModel request)
        {
            if (request == null || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var status = EnumHelper.Parse<ClaimStatus>(request.Status, "claim status");
            var updated = _claimService.UpdateStatus(id, status, CurrentUserId);
            return Ok(updated);
        }

        [HttpPut]
        [Route("{id:int}/reserve")]
        public IActionResult UpdateReserve(int id, ClaimReserveUpdateRequestViewModel request)
        {
            if (request == null || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updated = _claimService.UpdateReserve(id, request.ReserveAmount);
            return Ok(updated);
        }

        [HttpPost]
        [Route("{id:int}/payments")]
        public IActionResult RecordPayment(int id, ClaimPaymentRequestViewModel request)
        {
            if (request == null || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updated = _claimService.RecordPayment(id, request.Amount);
            return Ok(updated);
        }

        [HttpPut]
        [Route("{id:int}/handler")]
        public IActionResult AssignHandler(int id, ClaimHandlerAssignRequestViewModel request)
        {
            if (request == null || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updated = _claimService.AssignHandler(id, request.HandlerUserId);
            return Ok(updated);
        }

        [HttpPost]
        [Route("{id:int}/close")]
        public IActionResult Close(int id)
        {
            var updated = _claimService.CloseClaim(id);
            return Ok(updated);
        }

        private static ClaimDto MapEntityFallback(Domain.Entities.Claim c)
        {
            return new ClaimDto
            {
                Id = c.Id,
                ClaimNumber = c.ClaimNumber,
                PolicyId = c.PolicyId,
                PolicyNumber = c.Policy?.PolicyNumber,
                InsuredId = c.InsuredId,
                InsuredName = c.Insured?.Name,
                BrokerId = c.BrokerId,
                BrokerName = c.Broker?.Name,
                DateOfLoss = c.DateOfLoss,
                DateReported = c.DateReported,
                Description = c.Description,
                Status = c.Status,
                ReserveAmount = c.ReserveAmount,
                PaidAmount = c.PaidAmount,
                HandlerUserId = c.HandlerUserId,
                HandlerName = c.Handler?.FullName,
                ClosedDate = c.ClosedDate
            };
        }
    }
}
