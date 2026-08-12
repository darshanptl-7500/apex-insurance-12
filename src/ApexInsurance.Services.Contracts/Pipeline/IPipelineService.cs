using System.Collections.Generic;
using ApexInsurance.Services.Dto;

namespace ApexInsurance.Services.Pipeline
{
    public interface IPipelineService
    {
        PipelineSummaryDto GetSummary(int? underwriterId = null);
        IList<PipelineRowDto> GetBucket(string bucket, string search = null, string lineOfBusiness = null, int? underwriterId = null, int page = 1, int pageSize = 50);
    }
}
