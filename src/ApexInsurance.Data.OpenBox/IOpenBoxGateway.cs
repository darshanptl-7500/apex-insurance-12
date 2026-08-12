using System;
using System.Collections.Generic;
using ApexInsurance.Domain.Entities;

namespace ApexInsurance.Data.OpenBox
{
    /// <summary>
    /// Stub for Apex Open Box golden-source integration.
    /// In production UW this is a SOAP/ViewService client; here it mirrors Apex SQL.
    /// </summary>
    public interface IOpenBoxGateway
    {
        string Name { get; }
        bool IsAvailable();
        Policy GetPolicyByNumber(string policyNumber);
        IList<Policy> ListActivePolicies(int take = 50);
        int PolicyCount();

        /// <summary>Create wireframe risk in Open Box mirror; returns UW reference.</summary>
        RiskMarketDetail CreateRisk(OpenBoxCreateRiskRequest request);

        RiskMarketDetail GetMarketDetail(int submissionId);

        IList<RiskMarketDetail> ListRisks(int take = 100);

        /// <summary>Apply allowed UW edit fields; returns refreshed market detail.</summary>
        RiskMarketDetail UpdateUnderwritingFields(int submissionId, OpenBoxUwEditRequest request);

        void LogActivity(string systemName, string direction, string action, string reference, string status, string message, int? elapsedMs = null);
    }

    public class OpenBoxCreateRiskRequest
    {
        public int SubmissionId { get; set; }
        public string SubmissionNumber { get; set; }
        public DateTime Inception { get; set; }
        public DateTime? Expiry { get; set; }
        public string BrokerContact { get; set; }
        public string PolicyType { get; set; }
        public string Mop { get; set; }
        public string PolicyDescription { get; set; }
        public string RiskAppetite { get; set; }
        public string BusinessArea { get; set; }
        public string NewOrRenewal { get; set; }
        public bool IsDelegatedAuthority { get; set; }
        public string NotesType { get; set; }
    }

    public class OpenBoxUwEditRequest
    {
        public string RiskStatus { get; set; }
        public string BrokerContact { get; set; }
        public DateTime? Inception { get; set; }
        public DateTime? Expiry { get; set; }
        public string RiskAppetite { get; set; }
        public bool? RenewalWarning { get; set; }
        public bool? IsNonRenewable { get; set; }
        public string PolicyDescription { get; set; }
        public string PrincipalUw { get; set; }
        public string SubStat1 { get; set; }
        public string SubStat2 { get; set; }
        public string EtradingPlatform { get; set; }
        public string LicSecondee { get; set; }
        public string EsgStatus { get; set; }
        public string NotesType { get; set; }
        public string Notes { get; set; }
        public decimal? EstSigning { get; set; }
        public decimal? DedXs { get; set; }
        public decimal? PremRate { get; set; }
        public decimal? RiskChange { get; set; }
        public decimal? TcChange { get; set; }
        public decimal? OtherChange { get; set; }
        public decimal? ModelledLr { get; set; }
        public bool? FacilityFlag { get; set; }
        public bool? LbsFlag { get; set; }
        public bool? LicFlag { get; set; }
        public decimal? LongTermLossRatio { get; set; }
        public decimal? RateAdequacy { get; set; }
        public decimal? TechnicalIndex { get; set; }
    }
}
