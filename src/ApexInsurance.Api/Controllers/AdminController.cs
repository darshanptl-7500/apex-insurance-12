using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using ApexInsurance.Api.Filters;
using ApexInsurance.Api.Models.Admin;
using ApexInsurance.Domain.Enums;
using ApexInsurance.Services.Admin;
using ApexInsurance.Services.Dto;

namespace ApexInsurance.Api.Controllers
{
    [Route("api/admin")]
    [AuthorizeRole(UserRole.Admin)]
    [ApiController]
    public class AdminController : ApexApiControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet]
        [Route("users")]
        public IActionResult Users(bool activeOnly = false)
        {
            return Ok(_adminService.GetUsers(activeOnly));
        }

        [HttpPost]
        [Route("users")]
        public IActionResult CreateUser(CreateUserRequest request)
        {
            if (request == null) return BadRequest("Request body is required.");
            return Ok(_adminService.CreateUser(request));
        }

        [HttpPut]
        [Route("users/{id:int}")]
        public IActionResult UpdateUser(int id, UpdateUserRequest request)
        {
            if (request == null) return BadRequest("Request body is required.");
            request.Id = id;
            return Ok(_adminService.UpdateUser(request));
        }

        [HttpPost]
        [Route("users/{id:int}/deactivate")]
        public IActionResult DeactivateUser(int id)
        {
            _adminService.DeactivateUser(id);
            return Ok();
        }

        [HttpPost]
        [Route("users/{id:int}/reset-password")]
        public IActionResult ResetPassword(int id, [FromBody] string newPassword)
        {
            if (string.IsNullOrWhiteSpace(newPassword))
            {
                return BadRequest("A new password is required.");
            }

            _adminService.ResetPassword(id, newPassword);
            return Ok();
        }

        [HttpGet]
        [Route("rate-tables")]
        public IActionResult RateTables(string lob = null)
        {
            LineOfBusiness? filter = null;
            if (!string.IsNullOrWhiteSpace(lob) && Enum.TryParse(lob, true, out LineOfBusiness parsed))
            {
                filter = parsed;
            }
            return Ok(_adminService.GetRateTables(filter));
        }

        [HttpPost]
        [Route("rate-tables")]
        public IActionResult UpsertRateTable(RateTableRequest request)
        {
            if (request == null) return BadRequest("Request body is required.");
            return Ok(_adminService.UpsertRateTable(request));
        }

        [HttpGet]
        [Route("referral-rules")]
        public IActionResult ReferralRules()
        {
            return Ok(_adminService.GetReferralRules());
        }

        [HttpPost]
        [Route("referral-rules")]
        public IActionResult UpsertReferralRule(ReferralRuleRequest request)
        {
            if (request == null) return BadRequest("Request body is required.");
            return Ok(_adminService.UpsertReferralRule(request));
        }

        [HttpGet]
        [Route("authority-rules")]
        public IActionResult AuthorityRules()
        {
            return Ok(_adminService.GetAuthorityRules());
        }

        [HttpPost]
        [Route("authority-rules")]
        public IActionResult UpsertAuthorityRule(AuthorityRuleRequest request)
        {
            if (request == null) return BadRequest("Request body is required.");
            return Ok(_adminService.UpsertAuthorityRule(request));
        }

        [HttpGet]
        [Route("parameters")]
        public IActionResult Parameters()
        {
            return Ok(_adminService.GetParameters());
        }

        [HttpPut]
        [Route("parameters/{key}")]
        public IActionResult SetParameter(string key, SystemParameterRequest request)
        {
            if (request == null) request = new SystemParameterRequest();
            request.Key = key;
            return Ok(_adminService.SetParameter(request));
        }

        [HttpGet]
        [Route("holidays")]
        public IActionResult Holidays(int? year = null)
        {
            return Ok(_adminService.GetHolidays(year));
        }

        [HttpGet]
        [Route("trades")]
        public IActionResult Trades()
        {
            return Ok(_adminService.GetTrades());
        }

        [HttpGet]
        [Route("coverages")]
        public IActionResult Coverages(string lob = null)
        {
            LineOfBusiness? filter = null;
            if (!string.IsNullOrWhiteSpace(lob) && Enum.TryParse(lob, true, out LineOfBusiness parsed))
            {
                filter = parsed;
            }
            return Ok(_adminService.GetCoverages(filter));
        }

        [HttpGet]
        [Route("territories")]
        public IActionResult Territories()
        {
            return Ok(_adminService.GetTerritories());
        }

        [HttpGet]
        [Route("teams")]
        public IActionResult Teams()
        {
            return Ok(_adminService.GetTeams());
        }

        [HttpPost]
        [Route("teams")]
        public IActionResult CreateTeam(CreateTeamRequest request)
        {
            if (request == null) return BadRequest("Request body is required.");
            return Ok(_adminService.CreateTeam(request));
        }

        [HttpPost]
        [Route("holidays")]
        public IActionResult AddHoliday(AddHolidayRequestViewModel request)
        {
            if (request == null || !ModelState.IsValid) return BadRequest(ModelState);
            return Ok(_adminService.AddHoliday(request.HolidayDate, request.Description, request.CountryCode));
        }
    }
}
