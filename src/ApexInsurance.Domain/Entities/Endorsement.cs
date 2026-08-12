using System;

namespace ApexInsurance.Domain.Entities
{
    /// <summary>
    /// A mid-term change to a bound policy. Cancellations are also recorded as an endorsement so
    /// the premium movement stays on one audit trail.
    /// </summary>
    public class Endorsement : BaseEntity
    {
        public string EndorsementNumber { get; set; }
        public int PolicyId { get; set; }
        public string Description { get; set; }

        /// <summary>Signed premium movement: positive for additional premium, negative for a refund.</summary>
        public decimal PremiumChange { get; set; }

        public DateTime EffectiveDate { get; set; }
        public string Status { get; set; }
        public int? CreatedByUserId { get; set; }
        public DateTime CreatedDate { get; set; }

        public virtual Policy Policy { get; set; }

        public Endorsement()
        {
            CreatedDate = DateTime.UtcNow;
        }
    }
}
