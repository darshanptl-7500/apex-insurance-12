using Microsoft.AspNetCore.Mvc;
using ApexInsurance.Api.Filters;
using ApexInsurance.Api.Models.Common;
using ApexInsurance.Data.OpenBox;
using ApexInsurance.Domain.Entities;
using ApexInsurance.Services.Insureds;

namespace ApexInsurance.Api.Controllers
{
    [Route("api/insureds")]
    [AuthorizeRole]
    [ApiController]
    public class InsuredsController : ApexApiControllerBase
    {
        private readonly IInsuredService _insuredService;
        private readonly IOpenBoxIntegrationBus _bus;

        public InsuredsController(IInsuredService insuredService, IOpenBoxIntegrationBus bus)
        {
            _insuredService = insuredService;
            _bus = bus;
        }

        [HttpGet]
        [Route("")]
        public IActionResult List(string search = null, int page = 1, int pageSize = 25)
        {
            var result = _insuredService.List(search, page, pageSize);
            return Ok(new PagedResultViewModel<Insured>
            {
                Items = result.Items,
                TotalCount = result.TotalCount,
                Page = result.Page,
                PageSize = result.PageSize
            });
        }

        [HttpGet]
        [Route("{id:int}")]
        public IActionResult Get(int id)
        {
            var insured = _insuredService.GetById(id);
            if (insured == null)
            {
                return NotFound();
            }

            return Ok(insured);
        }

        /// <summary>GET api/insureds/search?term= - lightweight typeahead lookup, e.g. for the submission-creation form.</summary>
        [HttpGet]
        [Route("search")]
        public IActionResult Search(string term, int maxResults = 20)
        {
            return Ok(_insuredService.Search(term, maxResults));
        }

        /// <summary>
        /// Lab helper: simulate an external PAS/CRM publishing InsuredCreated onto RabbitMQ (party.insured).
        /// When the broker is unreachable, upserts locally so the demo still works.
        /// </summary>
        [HttpPost]
        [Route("from-external")]
        public IActionResult PublishFromExternal(InsuredPartyMessage request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Name))
            {
                return BadRequest(new { message = "Name is required." });
            }

            if (string.IsNullOrWhiteSpace(request.ExternalId))
            {
                request.ExternalId = "OBX-INS-" + System.DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            }

            if (string.IsNullOrWhiteSpace(request.EventType))
            {
                request.EventType = "InsuredCreated";
            }

            request.Source = string.IsNullOrWhiteSpace(request.Source) ? "OpenBox.Lab" : request.Source;
            _bus.PublishInsured(request);

            var health = _bus.Probe();
            if (!health.Connected || !string.Equals(health.Mode, "RabbitMQ", System.StringComparison.OrdinalIgnoreCase))
            {
                var local = _insuredService.UpsertFromExternal(new ExternalInsuredRequest
                {
                    EventType = request.EventType,
                    ExternalId = request.ExternalId,
                    Name = request.Name,
                    TradingName = request.TradingName,
                    RegistrationNumber = request.RegistrationNumber,
                    Address = request.Address,
                    City = request.City,
                    PostCode = request.PostCode,
                    TradeCode = request.TradeCode,
                    Occupancy = request.Occupancy,
                    OccurredUtc = request.OccurredUtc
                });

                return Ok(new
                {
                    published = false,
                    appliedLocally = true,
                    mode = health.Mode,
                    created = local.Created,
                    insured = local.Insured,
                    message = "Broker not live — upsert applied in-process."
                });
            }

            return Accepted(new
            {
                published = true,
                appliedLocally = false,
                mode = health.Mode,
                routingKey = "party.insured",
                externalId = request.ExternalId,
                message = "Published to RabbitMQ; insured consumer will upsert shortly."
            });
        }
    }
}
