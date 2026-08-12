using System;
using ApexInsurance.Domain.Enums;

namespace ApexInsurance.Domain.Entities
{
    /// <summary>
    /// Base rating for a line of business, optionally narrowed to a single trade. A trade-specific
    /// row takes precedence over the generic line-of-business row.
    /// </summary>
    public class RateTable : BaseEntity
    {
        public LineOfBusiness LineOfBusiness { get; set; }
        public int? TradeId { get; set; }
        public decimal BaseRatePer1000 { get; set; }
        public decimal MinPremium { get; set; }
        public DateTime EffectiveDate { get; set; }
        public DateTime? EffectiveTo { get; set; }
        public bool IsActive { get; set; }

        public virtual Trade Trade { get; set; }

        public RateTable()
        {
            EffectiveDate = DateTime.UtcNow;
            IsActive = true;
        }
    }
}
