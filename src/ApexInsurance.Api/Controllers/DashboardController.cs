using System;
using Microsoft.AspNetCore.Mvc;
using ApexInsurance.Api.Filters;
using ApexInsurance.Services.Dashboard;

namespace ApexInsurance.Api.Controllers
{
    [Route("api/dashboard")]
    [AuthorizeRole]
    [ApiController]
    public class DashboardController : ApexApiControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        /// <summary>
        /// Underwriter workbench landing view: queue counts, KPI tiles, and top broker
        /// production widgets. Defaults to the current calendar year-to-date when no
        /// explicit date range is supplied.
        /// </summary>
        [HttpGet]
        [Route("summary")]
        public IActionResult Summary(DateTime? fromDate = null, DateTime? toDate = null)
        {
            var to = toDate ?? DateTime.UtcNow;
            var from = fromDate ?? new DateTime(to.Year, 1, 1);

            var summary = _dashboardService.GetSummary(from, to);
            return Ok(summary);
        }

        [HttpGet]
        [Route("queues")]
        public IActionResult Queues()
        {
            return Ok(_dashboardService.GetQueues());
        }

        [HttpGet]
        [Route("kpis")]
        public IActionResult Kpis(DateTime? fromDate = null, DateTime? toDate = null)
        {
            var to = toDate ?? DateTime.UtcNow;
            var from = fromDate ?? new DateTime(to.Year, 1, 1);

            return Ok(_dashboardService.GetKpis(from, to));
        }

        [HttpGet]
        [Route("broker-performance")]
        public IActionResult BrokerPerformance(DateTime? fromDate = null, DateTime? toDate = null, int topN = 10)
        {
            var to = toDate ?? DateTime.UtcNow;
            var from = fromDate ?? new DateTime(to.Year, 1, 1);

            return Ok(_dashboardService.GetBrokerPerformance(from, to, topN));
        }
    }
}
