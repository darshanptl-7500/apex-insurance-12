using System.ComponentModel.DataAnnotations;

namespace ApexInsurance.Api.Models.Workflow
{
    /// <summary>Binds to ApexInsurance.Services.Dto.ReferralActionRequest; QuoteId/ActionedByUserId are always set server-side from the route/token.</summary>
    public class ReferralActionRequestViewModel
    {
        public string Comments { get; set; }
    }
}
