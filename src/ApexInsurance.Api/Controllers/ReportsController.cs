using System;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using ApexInsurance.Api.Filters;
using ApexInsurance.Domain.Enums;
using ApexInsurance.Services.Reporting;

namespace ApexInsurance.Api.Controllers
{
    [Route("api/reports")]
    [ApiController]
    [AuthorizeRole(UserRole.UnderwritingManager, UserRole.Admin, UserRole.Underwriter)]
    public class ReportsController : ApexApiControllerBase
    {
        private readonly IReportingService _reportingService;

        public ReportsController(IReportingService reportingService)
        {
            _reportingService = reportingService;
        }

        [HttpGet("premium-vs-target")]
        public IActionResult PremiumVsTarget(DateTime fromDate, DateTime toDate)
        {
            return Ok(_reportingService.PremiumVsTarget(fromDate, toDate));
        }

        [HttpGet("premium-vs-target/export")]
        public IActionResult ExportPremiumVsTarget(DateTime fromDate, DateTime toDate)
        {
            var report = _reportingService.ExportPremiumVsTarget(fromDate, toDate);
            return CsvResult(report.ReportName, report.ToCsv());
        }

        [HttpGet("broker-league")]
        public IActionResult BrokerLeague(DateTime fromDate, DateTime toDate, int top = 20)
        {
            return Ok(_reportingService.BrokerLeague(fromDate, toDate, top));
        }

        [HttpGet("broker-league/export")]
        public IActionResult ExportBrokerLeague(DateTime fromDate, DateTime toDate)
        {
            var report = _reportingService.ExportBrokerLeague(fromDate, toDate);
            return CsvResult(report.ReportName, report.ToCsv());
        }

        [HttpGet("pipeline")]
        public IActionResult Pipeline()
        {
            return Ok(_reportingService.PipelineAging());
        }

        [HttpGet("loss-ratio")]
        public IActionResult LossRatio(DateTime fromDate, DateTime toDate)
        {
            return Ok(_reportingService.LossRatio(fromDate, toDate));
        }

        private IActionResult CsvResult(string reportName, string csv)
        {
            var bytes = Encoding.UTF8.GetBytes(csv);
            return File(bytes, "text/csv", $"{reportName}.csv");
        }
    }
}
