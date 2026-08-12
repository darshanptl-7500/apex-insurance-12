using System;
using System.Collections.Generic;
using ApexInsurance.Domain.Enums;

namespace ApexInsurance.Domain.Entities
{
    public class Policy : BaseEntity
    {
        public string PolicyNumber { get; set; }
        public int QuoteId { get; set; }
        public int SubmissionId { get; set; }
        public int BrokerId { get; set; }
        public int InsuredId { get; set; }
        public LineOfBusiness LineOfBusiness { get; set; }
        public PolicyStatus Status { get; set; }

        public DateTime EffectiveDate { get; set; }
        public DateTime ExpiryDate { get; set; }

        public decimal GrossPremium { get; set; }
        public decimal NetPremium { get; set; }
        public decimal SumInsured { get; set; }
        public decimal LimitOfIndemnity { get; set; }
        public decimal Deductible { get; set; }

        public DateTime BoundDate { get; set; }
        public int? BoundByUserId { get; set; }

        public DateTime? CancelledDate { get; set; }
        public string CancellationReason { get; set; }

        /// <summary>Set when this policy was bound as the renewal of an expiring policy.</summary>
        public int? RenewedFromPolicyId { get; set; }

        public virtual Quote Quote { get; set; }
        public virtual Submission Submission { get; set; }
        public virtual Broker Broker { get; set; }
        public virtual Insured Insured { get; set; }
        public virtual Policy RenewedFromPolicy { get; set; }
        public virtual ICollection<Endorsement> Endorsements { get; set; } = new List<Endorsement>();
        public virtual ICollection<Claim> Claims { get; set; } = new List<Claim>();
        public virtual ICollection<Document> Documents { get; set; } = new List<Document>();

        public Policy()
        {
            Status = PolicyStatus.Active;
            BoundDate = DateTime.UtcNow;
        }
    }
}
