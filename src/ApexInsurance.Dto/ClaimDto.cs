using System;
using ApexInsurance.Domain.Enums;

namespace ApexInsurance.Services.Dto
{
    public class CreateFnolRequest
    {
        public int PolicyId { get; set; }
        public DateTime DateOfLoss { get; set; }
        public string Description { get; set; }
        public decimal InitialReserve { get; set; }
        public int ReportedByUserId { get; set; }
    }

    public class ClaimDto
    {
        public int Id { get; set; }
        public string ClaimNumber { get; set; }
        public int PolicyId { get; set; }
        public string PolicyNumber { get; set; }
        public int InsuredId { get; set; }
        public string InsuredName { get; set; }
        public int BrokerId { get; set; }
        public string BrokerName { get; set; }
        public DateTime DateOfLoss { get; set; }
        public DateTime DateReported { get; set; }
        public string Description { get; set; }
        public ClaimStatus Status { get; set; }
        public decimal ReserveAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal Incurred => ReserveAmount + PaidAmount;
        public int? HandlerUserId { get; set; }
        public string HandlerName { get; set; }
        public DateTime? ClosedDate { get; set; }
    }
}
