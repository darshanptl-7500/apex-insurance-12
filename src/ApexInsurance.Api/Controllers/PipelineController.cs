using Microsoft.AspNetCore.Mvc;
using ApexInsurance.Api.Filters;
using ApexInsurance.Services.Pipeline;

namespace ApexInsurance.Api.Controllers
{
    [Route("api/pipeline")]
    [AuthorizeRole]
    [ApiController]
    public class PipelineController : ApexApiControllerBase
    {
        private readonly IPipelineService _pipelineService;

        public PipelineController(IPipelineService pipelineService)
        {
            _pipelineService = pipelineService;
        }

        [HttpGet]
        [Route("summary")]
        public IActionResult Summary(int? underwriterId = null)
        {
            return Ok(_pipelineService.GetSummary(underwriterId));
        }

        [HttpGet]
        [Route("{bucket}")]
        public IActionResult Bucket(
            string bucket,
            string search = null,
            string lineOfBusiness = null,
            int? underwriterId = null,
            int page = 1,
            int pageSize = 50)
        {
            return Ok(_pipelineService.GetBucket(bucket, search, lineOfBusiness, underwriterId, page, pageSize));
        }
    }
}
