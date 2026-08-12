using System.Collections.Generic;
using ApexInsurance.Services.Dto;

namespace ApexInsurance.UI.ViewModels
{
    /// <summary>
    /// Server-side ViewModel shaping for Pipeline (UW UI layer).
    /// Controllers may project DTOs through these before JSON serialization.
    /// </summary>
    public class PipelineWorkbenchViewModel
    {
        public PipelineSummaryDto Summary { get; set; }
        public string ActiveBucket { get; set; }
        public IList<PipelineRowDto> Rows { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }

    public class UnderwriterFileViewModel
    {
        public UnderwriterFileDto File { get; set; }
        public string ActivePane { get; set; }
        public int? SelectedSectionId { get; set; }
    }

    public class SupportHealthViewModel
    {
        public IList<HealthCheckItemDto> Checks { get; set; }
        public bool AllHealthy { get; set; }
    }
}
