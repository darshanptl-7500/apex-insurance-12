using System;

namespace ApexInsurance.Domain.Entities
{
    /// <summary>
    /// Open Box–style market / UW file fields mirrored for the workbench (1:1 with Submission).
    /// PK is SubmissionId (not a surrogate Id).
    /// </summary>
    public class RiskMarketDetail
    {
        public int SubmissionId { get; set; }
        public string UwReference { get; set; }
        public int? Yoa { get; set; }
        public string Umr { get; set; }
        public string BrokerReference { get; set; }
        public string BrokerContact { get; set; }
        public string Mop { get; set; }
        public string PolicyType { get; set; }
        public string PolicyDescription { get; set; }
        public string RiskAppetite { get; set; }
        public string BusinessArea { get; set; }
        public string StatCode1 { get; set; }
        public string StatCode2 { get; set; }
        public string SubStat1 { get; set; }
        public string NewOrRenewal { get; set; }
        public bool IsDelegatedAuthority { get; set; }
        public bool IsNonRenewable { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string Reinsured { get; set; }
        public string Domicile { get; set; }
        public string SlipLeader { get; set; }
        public string Syndicate { get; set; }
        public string RiskCode { get; set; }
        public decimal? WrittenLine { get; set; }
        public decimal? SignedLine { get; set; }
        public decimal? EstSigning { get; set; }
        public decimal? ActSigning { get; set; }
        public decimal? BrokerOrder { get; set; }
        public decimal? NetSharePremium { get; set; }
        public decimal? ExpectedPremium { get; set; }
        public decimal? WeightedTi { get; set; }
        public decimal? WeightedRrm { get; set; }
        public decimal? LongTermLossRatio { get; set; }
        public decimal? RateAdequacy { get; set; }
        public decimal? TechnicalIndex { get; set; }
        public string EsgStatus { get; set; }
        public string NotesType { get; set; }
        public DateTime? LastTouchedUtc { get; set; }

        public bool RenewalWarning { get; set; }
        public string PrincipalUw { get; set; }
        public string SubStat2 { get; set; }
        public string EtradingPlatform { get; set; }
        public string LicSecondee { get; set; }
        public decimal? DedXs { get; set; }
        public decimal? PremRate { get; set; }
        public decimal? RiskChange { get; set; }
        public decimal? TcChange { get; set; }
        public decimal? OtherChange { get; set; }
        public decimal? ModelledLr { get; set; }
        public bool FacilityFlag { get; set; }
        public bool LbsFlag { get; set; } = true;
        public bool LicFlag { get; set; }

        public virtual Submission Submission { get; set; }
    }
}
