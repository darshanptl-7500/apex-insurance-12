using System;
using System.Collections.Generic;
using ApexInsurance.Domain.Enums;

namespace ApexInsurance.Services.Dto
{
    public class BindQuoteRequest
    {
        public int QuoteId { get; set; }
        public int BoundByUserId { get; set; }
    }

    public class EndorsePolicyRequest
    {
        public int PolicyId { get; set; }
        public string Description { get; set; }
        public decimal PremiumChange { get; set; }
        public DateTime EffectiveDate { get; set; }
        public int CreatedByUserId { get; set; }
    }

    public class CancelPolicyRequest
    {
        public int PolicyId { get; set; }
        public DateTime CancellationDate { get; set; }
        public string Reason { get; set; }
        public int CancelledByUserId { get; set; }
    }

    public class PolicyEndorsementDto
    {
        public int Id { get; set; }
        public string EndorsementNumber { get; set; }
        public DateTime EffectiveDate { get; set; }
        public string Description { get; set; }
        public decimal PremiumChange { get; set; }
        public string Status { get; set; }
    }

    public class PolicyDocumentDto
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public DateTime UploadedDate { get; set; }
        public string ContentType { get; set; }
    }

    public class PolicyDto
    {
        public int Id { get; set; }
        public string PolicyNumber { get; set; }
        public int SubmissionId { get; set; }
        public int BrokerId { get; set; }
        public string BrokerName { get; set; }
        public string BrokerContact { get; set; }
        public int InsuredId { get; set; }
        public string InsuredName { get; set; }
        public string UnderwriterName { get; set; }
        public LineOfBusiness LineOfBusiness { get; set; }
        public PolicyStatus Status { get; set; }
        public DateTime EffectiveDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public decimal GrossPremium { get; set; }
        public decimal NetPremium { get; set; }
        public decimal SumInsured { get; set; }
        public decimal LimitOfIndemnity { get; set; }
        public decimal Deductible { get; set; }
        public DateTime? BoundDate { get; set; }
        public DateTime? CancelledDate { get; set; }
        public string CancellationReason { get; set; }

        public IList<PolicyEndorsementDto> Endorsements { get; set; } = new List<PolicyEndorsementDto>();
        public IList<ClaimDto> Claims { get; set; } = new List<ClaimDto>();
        public IList<PolicyDocumentDto> Documents { get; set; } = new List<PolicyDocumentDto>();
    }

    public class RenewalDiaryItem
    {
        public int PolicyId { get; set; }
        public string PolicyNumber { get; set; }
        public string InsuredName { get; set; }
        public string BrokerName { get; set; }
        public DateTime ExpiryDate { get; set; }
        public int DaysToExpiry { get; set; }
        public decimal ExpiringPremium { get; set; }
        public bool RenewalSubmissionCreated { get; set; }
    }
}
