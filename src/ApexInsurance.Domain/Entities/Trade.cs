using System.Collections.Generic;

namespace ApexInsurance.Domain.Entities
{
    public class Trade : BaseEntity
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string RiskCategory { get; set; }

        /// <summary>Restricted trades attract <see cref="LoadingPercent"/> and can force a referral.</summary>
        public bool IsRestricted { get; set; }

        public decimal LoadingPercent { get; set; }

        public virtual ICollection<Insured> Insureds { get; set; } = new List<Insured>();
        public virtual ICollection<RateTable> RateTables { get; set; } = new List<RateTable>();
        public virtual ICollection<ReferralRule> ReferralRules { get; set; } = new List<ReferralRule>();
    }
}
