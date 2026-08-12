using System;
using ApexInsurance.Domain.Enums;

namespace ApexInsurance.Domain.Entities
{
    public class Quote : BaseEntity
    {
        public string QuoteNumber { get; set; }
        public int SubmissionId { get; set; }

        /// <summary>Incrementing version within the submission; the highest version is the current quote.</summary>
        public int VersionNumber { get; set; }

        public decimal SumInsured { get; set; }
        public decimal LimitOfIndemnity { get; set; }
        public decimal Deductible { get; set; }
        public decimal GrossPremium { get; set; }
        public decimal NetPremium { get; set; }
        public decimal CommissionPercent { get; set; }
        public decimal CommissionAmount { get; set; }

        public bool IsReferralRequired { get; set; }
        public string ReferralReason { get; set; }
        public string ReferralComments { get; set; }
        public ReferralDecision ReferralDecision { get; set; }
        public int? ReferralDecisionByUserId { get; set; }
        public DateTime? ReferralDecisionDate { get; set; }

        /// <summary>Serialized PremiumBreakdown, retained so the rating can be re-displayed unchanged.</summary>
        public string RatingBreakdownJson { get; set; }

        /// <summary>True for the single quote the broker accepted; cleared on the sibling versions.</summary>
        public bool IsSelected { get; set; }

        public int? CreatedByUserId { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public string Notes { get; set; }

        public virtual Submission Submission { get; set; }
        public virtual User ReferralDecisionByUser { get; set; }

        public Quote()
        {
            VersionNumber = 1;
            ReferralDecision = ReferralDecision.NotRequired;
            CreatedDate = DateTime.UtcNow;
            ExpiryDate = DateTime.UtcNow.AddDays(30);
        }
    }
}
