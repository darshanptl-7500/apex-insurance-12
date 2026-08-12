using System.Linq;
using Microsoft.AspNetCore.Mvc;
using ApexInsurance.Api.Filters;
using ApexInsurance.Api.Models.Modelling;
using ApexInsurance.Domain.Enums;
using ApexInsurance.Services.Modelling;

namespace ApexInsurance.Api.Controllers
{
    [Route("api/modelling")]
    [AuthorizeRole(UserRole.UnderwritingManager, UserRole.Admin, UserRole.Underwriter)]
    [ApiController]
    public class ModellingController : ApexApiControllerBase
    {
        private readonly IModellingService _modellingService;

        public ModellingController(IModellingService modellingService)
        {
            _modellingService = modellingService;
        }

        [HttpGet]
        [Route("exposure")]
        public IActionResult Exposure(string groupBy = "lob")
        {
            switch ((groupBy ?? "lob").ToLowerInvariant())
            {
                case "territory":
                    return Ok(_modellingService.GetExposureByTerritory().Select(ToViewModel).ToList());
                case "broker":
                    return Ok(_modellingService.GetExposureByBroker().Select(ToViewModel).ToList());
                default:
                    return Ok(_modellingService.GetExposureByLob().Select(ToViewModel).ToList());
            }
        }

        [HttpGet]
        [Route("exposure/by-lob")]
        public IActionResult ExposureByLob()
        {
            return Ok(_modellingService.GetExposureByLob().Select(ToViewModel).ToList());
        }

        [HttpGet]
        [Route("exposure/by-territory")]
        public IActionResult ExposureByTerritory()
        {
            return Ok(_modellingService.GetExposureByTerritory().Select(ToViewModel).ToList());
        }

        [HttpGet]
        [Route("exposure/by-broker")]
        public IActionResult ExposureByBroker()
        {
            return Ok(_modellingService.GetExposureByBroker().Select(ToViewModel).ToList());
        }

        [HttpGet]
        [Route("concentration-summary")]
        public IActionResult ConcentrationSummary()
        {
            var summary = _modellingService.GetConcentrationSummary();
            return Ok(new
            {
                summary.TotalSumInsured,
                summary.TotalGrossPremium,
                summary.ActivePolicyCount,
                summary.LargestSingleRiskSumInsured,
                summary.LargestRiskPolicyNumber,
                summary.TopLob,
                summary.TopLobSharePercent
            });
        }

        private static ExposureViewModel ToViewModel(ExposureRow e)
        {
            return new ExposureViewModel
            {
                Dimension = e.Label,
                Key = e.Key,
                SumInsured = e.SumInsured,
                GrossPremium = e.GrossPremium,
                PolicyCount = e.PolicyCount
            };
        }
    }
}
