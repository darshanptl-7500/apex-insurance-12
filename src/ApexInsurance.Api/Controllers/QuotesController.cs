using System.Linq;
using Microsoft.AspNetCore.Mvc;
using ApexInsurance.Api.Filters;
using ApexInsurance.Services.Dto;
using ApexInsurance.Services.Quotes;

namespace ApexInsurance.Api.Controllers
{
    [Route("api/quotes")]
    [AuthorizeRole]
    [ApiController]
    public class QuotesController : ApexApiControllerBase
    {
        private readonly IQuoteService _quoteService;

        public QuotesController(IQuoteService quoteService)
        {
            _quoteService = quoteService;
        }

        [HttpPost]
        [Route("")]
        public IActionResult Create(CreateQuoteRequest request)
        {
            if (request == null)
            {
                return BadRequest("Request body is required.");
            }

            // CreatedByUserId always comes from the authenticated caller, never the request body.
            request.CreatedByUserId = CurrentUserId;

            var created = _quoteService.CreateQuote(request);
            return Created($"api/quotes/{created.Id}", created);
        }

        [HttpGet]
        [Route("{id:int}")]
        public IActionResult Get(int id)
        {
            var quote = _quoteService.GetQuoteById(id);
            if (quote == null)
            {
                return NotFound();
            }

            return Ok(quote);
        }

        /// <summary>GET api/quotes/by-submission/{submissionId} - every quote version raised for a submission.</summary>
        [HttpGet]
        [Route("by-submission/{submissionId:int}")]
        public IActionResult ListBySubmission(int submissionId)
        {
            return Ok(_quoteService.GetQuotesForSubmission(submissionId).ToList());
        }

        [HttpPut]
        [Route("{id:int}/select")]
        public IActionResult Select(int id)
        {
            var selected = _quoteService.SelectQuote(id);
            return Ok(selected);
        }
    }
}
