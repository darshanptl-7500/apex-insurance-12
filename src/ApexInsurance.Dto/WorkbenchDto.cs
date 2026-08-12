using System;
using System.Collections.Generic;

namespace ApexInsurance.Services.Dto
{
    public class PipelineSummaryDto
    {
        public int Upcoming { get; set; }
        public int Bound { get; set; }
        public int NtuDeclined { get; set; }
        public int DayFile { get; set; }
        public int Queries { get; set; }
        public int Referrals { get; set; }
        public int OpenTasks { get; set; }
        public int DelegatedAuthority { get; set; }
        public int RecentActivity { get; set; }
        public int EPlacement { get; set; }
    }

    public class PipelineRowDto
    {
        public string Bucket { get; set; }
        public string RowType { get; set; }
        public int EntityId { get; set; }
        public int? SubmissionId { get; set; }
        public int? PolicyId { get; set; }
        public string Reference { get; set; }
        public string AccountName { get; set; }
        public string LineOfBusiness { get; set; }
        public string BusinessArea { get; set; }
        public string StatCode1 { get; set; }
        public string Mop { get; set; }
        public string NewOrRenewal { get; set; }
        public string Status { get; set; }
        public string UnderwriterName { get; set; }
        public string BrokerName { get; set; }
        public string BrokerContact { get; set; }
        public DateTime? Inception { get; set; }
        public DateTime? Expiry { get; set; }
        public decimal? Premium { get; set; }
        public decimal? NetPremium { get; set; }
        public decimal? NetSharePremium { get; set; }
        public decimal? Exposure { get; set; }
        public string Description { get; set; }
        public bool IsReferral { get; set; }
        public bool IsOverdue { get; set; }
        public bool IsDelegatedAuthority { get; set; }
        public bool HasSecondSight { get; set; }
        public bool HasFrontSheet { get; set; }
        public bool HasModelling { get; set; }
        public int? Yoa { get; set; }
        public bool IsNonRenewable { get; set; }
    }

    public class UnderwriterFileDto
    {
        public int SubmissionId { get; set; }
        public string SubmissionNumber { get; set; }
        public string Status { get; set; }
        public string LineOfBusiness { get; set; }
        public string InsuredName { get; set; }
        public string BrokerName { get; set; }
        public string UnderwriterName { get; set; }
        public int? UnderwriterUserId { get; set; }
        public DateTime? RequestedEffectiveDate { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime ReceivedDate { get; set; }
        public decimal? TargetPremium { get; set; }
        public string Notes { get; set; }
        public int? PolicyId { get; set; }
        public string PolicyNumber { get; set; }
        public string PolicyStatus { get; set; }
        public DateTime? PolicyEffectiveDate { get; set; }
        public DateTime? PolicyExpiryDate { get; set; }
        public decimal? SumInsured { get; set; }
        public decimal? GrossPremium { get; set; }
        public decimal? NetPremium { get; set; }

        // Open Box / London Market identity (FR-05)
        public int? Yoa { get; set; }
        public string Umr { get; set; }
        public string BrokerReference { get; set; }
        public string BrokerContact { get; set; }
        public string Mop { get; set; }
        public string PolicyDescription { get; set; }
        public string PolicyType { get; set; }
        public string RiskAppetite { get; set; }
        public string BusinessArea { get; set; }
        public string Reinsured { get; set; }
        public string Domicile { get; set; }
        public string SlipLeader { get; set; }
        public string UwReference { get; set; }
        public decimal? ExpectedPremium { get; set; }
        public decimal? NetSignedPremium { get; set; }
        public decimal? WeightedTi { get; set; }
        public decimal? WeightedRrm { get; set; }
        public decimal? LongTermLossRatio { get; set; }
        public decimal? RateAdequacy { get; set; }
        public string EsgStatus { get; set; }
        public string NotesType { get; set; }
        public bool IsDelegatedAuthority { get; set; }
        public bool IsNonRenewable { get; set; }
        public IList<UnderwriterFilePremiumScheduleDto> PremiumSchedule { get; set; } = new List<UnderwriterFilePremiumScheduleDto>();

        public IList<UnderwriterFileSectionDto> Sections { get; set; } = new List<UnderwriterFileSectionDto>();
        public IList<UnderwriterFileDocumentDto> Documents { get; set; } = new List<UnderwriterFileDocumentDto>();
        public IList<UnderwriterFileActivityDto> ActivityLog { get; set; } = new List<UnderwriterFileActivityDto>();
        public IList<UnderwriterFileClaimDto> Claims { get; set; } = new List<UnderwriterFileClaimDto>();
        public IList<UnderwriterFileAssociationDto> Associations { get; set; } = new List<UnderwriterFileAssociationDto>();
        public UnderwriterFilePerformanceDto Performance { get; set; }
    }

    public class UnderwriterFileSectionDto
    {
        public int QuoteId { get; set; }
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
        public string ReferralDecision { get; set; }
        public string BusinessArea { get; set; }
        public string StatCode1 { get; set; }
        public string StatCode2 { get; set; }
        public string SubStat1 { get; set; }
        public string SubStat2 { get; set; }
        public string Syndicate { get; set; }
        public decimal? WrittenLine { get; set; }
        public decimal? SignedLine { get; set; }
        public decimal? EstSigning { get; set; }
        public decimal? ActSigning { get; set; }
        public decimal? BrokerOrder { get; set; }
        public decimal? TechnicalIndex { get; set; }
        public string RiskCode { get; set; }
        public DateTime? Inception { get; set; }
        public DateTime? Expiry { get; set; }
        public string UwPrincipal { get; set; }
        public string GomWind { get; set; }
        public bool Lbs { get; set; }
        public bool Lic { get; set; }
        public bool LicRisk { get; set; }
        public bool Facility { get; set; }
        public decimal? Exposure { get; set; }
        public decimal? Rrm { get; set; }
        public decimal? DedXs { get; set; }
        public decimal? PremRate { get; set; }
        public decimal? RiskChange { get; set; }
        public decimal? TcChange { get; set; }
        public decimal? OtherChange { get; set; }
        public decimal? ModelledLr { get; set; }
        public string Basis { get; set; }
        public string LicSecondee { get; set; }
        public string EtradingPlatform { get; set; }
        public string Ccy { get; set; }
        public bool FacRi { get; set; }
        public decimal? KpiTotal { get; set; }

        public IList<UnderwriterFileGridRowDto> LimitsRows { get; set; } = new List<UnderwriterFileGridRowDto>();
        public IList<UnderwriterFileGridRowDto> PremiumRows { get; set; } = new List<UnderwriterFileGridRowDto>();
        public IList<UnderwriterFileGridRowDto> PerformanceRows { get; set; } = new List<UnderwriterFileGridRowDto>();
        public IList<UnderwriterFileGridRowDto> BureauRows { get; set; } = new List<UnderwriterFileGridRowDto>();
        public IList<UnderwriterFileGridRowDto> DeductionRows { get; set; } = new List<UnderwriterFileGridRowDto>();
        public IList<UnderwriterFileGridRowDto> OutwardsRiRows { get; set; } = new List<UnderwriterFileGridRowDto>();
        public IList<UnderwriterFileGridRowDto> DeclarationRows { get; set; } = new List<UnderwriterFileGridRowDto>();
    }

    public class UnderwriterFilePremiumScheduleDto
    {
        public string UwReference { get; set; }
        public DateTime? Inception { get; set; }
        public DateTime? Expiry { get; set; }
        public decimal? Egpi { get; set; }
        public decimal? Commission { get; set; }
        public decimal? Brokerage { get; set; }
        public decimal? Pc { get; set; }
        public decimal? PcPaidToDate { get; set; }
        public decimal? Ilr { get; set; }
    }

    public class UnderwriterFileGridRowDto
    {
        public string Col1 { get; set; }
        public string Col2 { get; set; }
        public string Col3 { get; set; }
        public string Col4 { get; set; }
        public string Col5 { get; set; }
        public string Col6 { get; set; }
        public string Col7 { get; set; }
        public string Col8 { get; set; }
    }

    public class UnderwriterFileDocumentDto
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string DocumentType { get; set; }
        public int VersionNumber { get; set; }
        public string Notes { get; set; }
        public DateTime UploadedDate { get; set; }
        public string ContentType { get; set; }
        public string Author { get; set; }
        public string EndorsementNo { get; set; }
        public string DisplayName { get; set; }
        public string ExternalReference { get; set; }
    }

    public class UnderwriterFileActivityDto
    {
        public string ActivityType { get; set; }
        public string Title { get; set; }
        public string Detail { get; set; }
        public string OwnerName { get; set; }
        public string CompletedByName { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? CompletedDate { get; set; }
        public string Status { get; set; }
        public int? RelatedEntityId { get; set; }
        public string DocInfo { get; set; }
        public string LloydsPin { get; set; }
        public string Reference { get; set; }
    }

    public class UnderwriterFileClaimDto
    {
        public int Id { get; set; }
        public string ClaimNumber { get; set; }
        public string Status { get; set; }
        public DateTime? DateOfLoss { get; set; }
        public DateTime? DateOfNotification { get; set; }
        public decimal ReserveAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public string Ucr { get; set; }
        public string Claimant { get; set; }
        public string Location { get; set; }
        public string Ccy { get; set; }
        public decimal? Ptd { get; set; }
        public decimal? ApexShareNp { get; set; }
        public decimal? Ilr { get; set; }
        public decimal? Cap { get; set; }
        public decimal? Exposure { get; set; }
    }

    public class UnderwriterFileAssociationDto
    {
        public string Kind { get; set; }
        public string Label { get; set; }
        public string Link { get; set; }
        public string Description { get; set; }
        public int? Yoa { get; set; }
        public string Notes { get; set; }
        public decimal? GrossPremium { get; set; }
        public decimal? NetPremium { get; set; }
        public decimal? Exposure { get; set; }
    }

    public class UnderwriterFilePerformanceDto
    {
        public decimal GrossPremium { get; set; }
        public decimal NetPremium { get; set; }
        public decimal PaidClaims { get; set; }
        public decimal OutstandingReserve { get; set; }
        public decimal IncurredClaims { get; set; }
        public IList<UnderwriterFilePerformanceLineDto> LineShare { get; set; } = new List<UnderwriterFilePerformanceLineDto>();
        public IList<UnderwriterFilePerformanceLineDto> FullOrder { get; set; } = new List<UnderwriterFilePerformanceLineDto>();
    }

    public class UnderwriterFilePerformanceLineDto
    {
        public int? Yoa { get; set; }
        public string Ccy { get; set; }
        public decimal GrossPremium { get; set; }
        public decimal NetPremium { get; set; }
        public decimal PaidClaims { get; set; }
        public decimal OutstandingReserve { get; set; }
        public decimal IncurredClaims { get; set; }
        public decimal? LossRatio { get; set; }
    }

    public class HealthCheckItemDto
    {
        public string Name { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public double ElapsedSeconds { get; set; }
        public string Endpoint { get; set; }
    }
}
