using Microsoft.AspNetCore.Mvc;
using ApexInsurance.Api.Filters;
using ApexInsurance.Api.Models.Common;
using ApexInsurance.Domain.Entities;
using ApexInsurance.Domain.Enums;
using ApexInsurance.Services.Brokers;

namespace ApexInsurance.Api.Controllers
{
    [Route("api/brokers")]
    [AuthorizeRole]
    [ApiController]
    public class BrokersController : ApexApiControllerBase
    {
        private readonly IBrokerService _brokerService;

        public BrokersController(IBrokerService brokerService)
        {
            _brokerService = brokerService;
        }

        [HttpGet]
        [Route("")]
        public IActionResult List(string search = null, bool? isActive = null, int page = 1, int pageSize = 25)
        {
            var result = _brokerService.List(search, isActive, page, pageSize);
            return Ok(new PagedResultViewModel<Broker>
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
            var broker = _brokerService.GetById(id);
            if (broker == null)
            {
                return NotFound();
            }

            return Ok(broker);
        }

        [HttpPost]
        [Route("")]
        [AuthorizeRole(UserRole.BrokerOps, UserRole.Admin)]
        public IActionResult Create(CreateBrokerRequest request)
        {
            if (request == null)
            {
                return BadRequest("Request body is required.");
            }

            var created = _brokerService.Create(request);
            return Created($"api/brokers/{created.Id}", created);
        }

        [HttpPut]
        [Route("{id:int}")]
        [AuthorizeRole(UserRole.BrokerOps, UserRole.Admin)]
        public IActionResult Update(int id, UpdateBrokerRequest request)
        {
            if (request == null)
            {
                return BadRequest("Request body is required.");
            }

            request.Id = id;
            return Ok(_brokerService.Update(request));
        }

        [HttpPost]
        [Route("{id:int}/deactivate")]
        [AuthorizeRole(UserRole.BrokerOps, UserRole.Admin)]
        public IActionResult Deactivate(int id)
        {
            return Ok(_brokerService.Deactivate(id));
        }

        /// <summary>GET api/brokers/{id}/performance - submission/bind counts, GWP, hit ratio, and loss ratio for one broker.</summary>
        [HttpGet]
        [Route("{id:int}/performance")]
        public IActionResult Performance(int id)
        {
            var performance = _brokerService.GetPerformance(id);
            return Ok(performance);
        }
    }
}
