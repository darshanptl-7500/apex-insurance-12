using System;
using Microsoft.AspNetCore.Mvc;
using ApexInsurance.Api.Filters;
using ApexInsurance.Domain.Enums;
using ApexInsurance.Services.Audit;
using ApexInsurance.Services.Dto;

namespace ApexInsurance.Api.Controllers
{
    [Route("api/audit")]
    [AuthorizeRole(UserRole.Admin, UserRole.UnderwritingManager)]
    [ApiController]
    public class AuditController : ApexApiControllerBase
    {
        private readonly IAuditService _auditService;

        public AuditController(IAuditService auditService)
        {
            _auditService = auditService;
        }

        /// <summary>GET api/audit/logs?entityName=&amp;entityId=&amp;userId=&amp;fromDate=&amp;toDate=</summary>
        [HttpGet]
        [Route("logs")]
        public IActionResult QueryLogs(
            string entityName = null,
            int? entityId = null,
            int? userId = null,
            DateTime? fromDate = null,
            DateTime? toDate = null)
        {
            var results = _auditService.QueryAuditLogs(new AuditLogQuery
            {
                EntityName = entityName,
                EntityId = entityId,
                UserId = userId,
                FromDate = fromDate,
                ToDate = toDate
            });

            return Ok(results);
        }

        [HttpGet]
        [Route("logins")]
        public IActionResult QueryLogins(string username = null, DateTime? fromDate = null, DateTime? toDate = null)
        {
            return Ok(_auditService.QueryLoginAudits(username, fromDate, toDate));
        }
    }
}
