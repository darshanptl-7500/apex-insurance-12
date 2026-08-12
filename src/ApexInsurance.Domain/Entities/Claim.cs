using System;
using ApexInsurance.Domain.Enums;

namespace ApexInsurance.Domain.Entities
{
    public class Claim : BaseEntity
    {
        public string ClaimNumber { get; set; }
        public int PolicyId { get; set; }
        public int InsuredId { get; set; }
        public int BrokerId { get; set; }
        public ClaimStatus Status { get; set; }

        public DateTime DateOfLoss { get; set; }
        public DateTime DateReported { get; set; }
        public string Description { get; set; }

        public decimal ReserveAmount { get; set; }
        public decimal PaidAmount { get; set; }

        public int? HandlerUserId { get; set; }
        public DateTime? ClosedDate { get; set; }
        public DateTime CreatedDate { get; set; }

        public virtual Policy Policy { get; set; }
        public virtual Insured Insured { get; set; }
        public virtual Broker Broker { get; set; }
        public virtual User Handler { get; set; }

        public Claim()
        {
            Status = ClaimStatus.Open;
            DateReported = DateTime.UtcNow;
            CreatedDate = DateTime.UtcNow;
        }
    }
}
