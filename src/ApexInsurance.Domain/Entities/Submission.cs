using System;
using System.Collections.Generic;
using ApexInsurance.Domain.Enums;

namespace ApexInsurance.Domain.Entities
{
    public class Submission : BaseEntity
    {
        public string SubmissionNumber { get; set; }
        public int BrokerId { get; set; }
        public int InsuredId { get; set; }
        public int? UnderwriterUserId { get; set; }
        public LineOfBusiness LineOfBusiness { get; set; }
        public SubmissionStatus Status { get; set; }
        public decimal? TargetPremium { get; set; }
        public DateTime RequestedEffectiveDate { get; set; }
        public DateTime ReceivedDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? AssignedDate { get; set; }
        public DateTime? DueDate { get; set; }

        /// <summary>Set when this submission was raised as the renewal of an expiring policy.</summary>
        public int? RenewedFromPolicyId { get; set; }

        public string Notes { get; set; }

        public virtual Broker Broker { get; set; }
        public virtual Insured Insured { get; set; }
        public virtual User Underwriter { get; set; }
        public virtual Policy RenewedFromPolicy { get; set; }
        public virtual RiskMarketDetail MarketDetail { get; set; }
        public virtual ICollection<RiskAnswer> RiskAnswers { get; set; } = new List<RiskAnswer>();
        public virtual ICollection<Quote> Quotes { get; set; } = new List<Quote>();
        public virtual ICollection<Document> Documents { get; set; } = new List<Document>();
        public virtual ICollection<WorkflowTask> Tasks { get; set; } = new List<WorkflowTask>();

        public Submission()
        {
            Status = SubmissionStatus.Received;
            ReceivedDate = DateTime.UtcNow;
            CreatedDate = DateTime.UtcNow;
        }
    }
}
