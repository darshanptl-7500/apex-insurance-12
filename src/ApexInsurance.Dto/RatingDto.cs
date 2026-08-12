using ApexInsurance.Domain.Enums;

namespace ApexInsurance.Services.Dto
{
    public class PremiumCalculationRequest
    {
        public LineOfBusiness LineOfBusiness { get; set; }
        public string TradeCode { get; set; }
        public decimal SumInsured { get; set; }
        public decimal LimitOfIndemnity { get; set; }
        public decimal Deductible { get; set; }
        public decimal CommissionPercent { get; set; }
    }

    /// <summary>Transparent breakdown of how a premium was derived, for underwriter review.</summary>
    public class PremiumBreakdown
    {
        public decimal RateBasis { get; set; }
        public decimal BaseRatePer1000 { get; set; }
        public decimal BasePremium { get; set; }

        public bool TradeIsRestricted { get; set; }
        public decimal TradeLoadingPercent { get; set; }
        public decimal TradeLoadingAmount { get; set; }

        public decimal DeductibleCreditPercent { get; set; }
        public decimal DeductibleCreditAmount { get; set; }

        public decimal PremiumBeforeMinimum { get; set; }
        public bool MinimumPremiumApplied { get; set; }
        public decimal MinimumPremium { get; set; }

        public decimal GrossPremium { get; set; }
        public decimal CommissionPercent { get; set; }
        public decimal CommissionAmount { get; set; }
        public decimal NetPremium { get; set; }
    }
}
