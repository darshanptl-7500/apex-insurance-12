using ApexInsurance.Domain.Enums;

namespace ApexInsurance.Domain.Entities
{
    /// <summary>
    /// Underwriting guardrail evaluated when a quote is rated. Any threshold left null is not
    /// tested, so a rule can trigger on sum insured, limit, restricted trade, or a combination.
    /// </summary>
    public class ReferralRule : BaseEntity
    {
        public LineOfBusiness LineOfBusiness { get; set; }
        public int? TradeId { get; set; }
        public decimal? MinSumInsured { get; set; }
        public decimal? MaxSumInsured { get; set; }
        public decimal? MinLimit { get; set; }
        public decimal? MaxLimit { get; set; }
        public bool TriggersOnRestrictedTrade { get; set; }
        public string Reason { get; set; }
        public bool IsActive { get; set; }

        public virtual Trade Trade { get; set; }

        public ReferralRule()
        {
            IsActive = true;
        }
    }
}
