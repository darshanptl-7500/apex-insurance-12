using System.Linq;
using Microsoft.AspNetCore.Mvc;
using ApexInsurance.Api.Filters;
using ApexInsurance.Api.Infrastructure;
using ApexInsurance.Api.Models.Authority;
using ApexInsurance.Data;
using ApexInsurance.Domain.Enums;
using ApexInsurance.Services.Authority;
using ApexInsurance.Services.Dto;

namespace ApexInsurance.Api.Controllers
{
    [Route("api/authority")]
    [AuthorizeRole]
    [ApiController]
    public class AuthorityController : ApexApiControllerBase
    {
        private readonly IAuthorityService _authorityService;
        private readonly IUnitOfWork _unitOfWork;

        public AuthorityController(IAuthorityService authorityService, IUnitOfWork unitOfWork)
        {
            _authorityService = authorityService;
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// POST api/authority/check - evaluates whether the CURRENT USER's role has sufficient
        /// underwriting authority for a given premium/sum-insured/limit combination on a line of
        /// business, or whether the quote must be referred up. Role always comes from the bearer
        /// token, never the request body.
        /// </summary>
        [HttpPost]
        [Route("check")]
        public IActionResult Check(AuthorityCheckRequestViewModel request)
        {
            if (request == null || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var role = EnumHelper.Parse<UserRole>(CurrentUser?.Role, "user role");
            var lob = EnumHelper.Parse<LineOfBusiness>(request.LineOfBusiness, "line of business");

            var result = _authorityService.CheckAuthority(new AuthorityCheckRequest
            {
                Role = role,
                LineOfBusiness = lob,
                SumInsured = request.SumInsured,
                LimitOfIndemnity = request.LimitOfIndemnity,
                Premium = request.Premium
            });

            return Ok(result);
        }

        /// <summary>GET api/authority/rules - no listing method on IAuthorityService, so this reads IUnitOfWork.AuthorityRules directly.</summary>
        [HttpGet]
        [Route("rules")]
        public IActionResult ListRules()
        {
            var rules = _unitOfWork.AuthorityRules.GetAll()
                .Select(r => new AuthorityRuleViewModel
                {
                    Id = r.Id,
                    Role = r.Role.ToString(),
                    LineOfBusiness = r.LineOfBusiness.ToString(),
                    MaxPremium = r.MaxPremium,
                    MaxSumInsured = r.MaxSumInsured,
                    MaxLimit = r.MaxLimit,
                    IsActive = r.IsActive
                })
                .ToList();

            return Ok(rules);
        }
    }
}
