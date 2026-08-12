using System;
using ApexInsurance.Domain.Enums;

namespace ApexInsurance.Services.Dto
{
    public class CreateQuoteRequest
    {
        public int SubmissionId { get; set; }
        public decimal SumInsured { get; set; }
        public decimal LimitOfIndemnity { get; set; }
        public decimal Deductible { get; set; }
        public decimal CommissionPercent { get; set; }
        public int CreatedByUserId { get; set; }
    }

    public class QuoteDto
    {
        public int Id { get; set; }
        public int SubmissionId { get; set; }
        public string QuoteNumber { get; set; }
        public int VersionNumber { get; set; }
        public bool IsSelected { get; set; }
        public decimal SumInsured { get; set; }
        public decimal LimitOfIndemnity { get; set; }
        public decimal Deductible { get; set; }
        public decimal GrossPremium { get; set; }
        public decimal NetPremium { get; set; }
        public decimal CommissionAmount { get; set; }
        public bool IsReferralRequired { get; set; }
        public string ReferralReason { get; set; }
        public ReferralDecision ReferralDecision { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public PremiumBreakdown Breakdown { get; set; }
    }

    /// <summary>Manager referral queue row — quote plus submission context.</summary>
    public class ReferralQueueItemDto
    {
        public int QuoteId { get; set; }
        public string QuoteNumber { get; set; }
        public int VersionNumber { get; set; }
        public int SubmissionId { get; set; }
        public string SubmissionNumber { get; set; }
        public string InsuredName { get; set; }
        public string BrokerName { get; set; }
        public string LineOfBusiness { get; set; }
        public string UnderwriterName { get; set; }
        public decimal SumInsured { get; set; }
        public decimal LimitOfIndemnity { get; set; }
        public decimal GrossPremium { get; set; }
        public string ReferralReason { get; set; }
        public string ReferralDecision { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
