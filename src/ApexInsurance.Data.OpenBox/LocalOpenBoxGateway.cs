using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using ApexInsurance.Data;
using ApexInsurance.Domain.Entities;
using ApexInsurance.Domain.Enums;

namespace ApexInsurance.Data.OpenBox
{
    /// <summary>
    /// In-process Open Box adapter: Apex SQL is the local mirror of OBX.
    /// Writes go through this gateway then into local tables (FR-17.1).
    /// </summary>
    public class LocalOpenBoxGateway : IOpenBoxGateway
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOpenBoxIntegrationBus _bus;

        public LocalOpenBoxGateway(IUnitOfWork unitOfWork, IOpenBoxIntegrationBus bus = null)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _bus = bus;
        }

        public string Name => "OpenBox (local mirror)";

        public bool IsAvailable()
        {
            try
            {
                _unitOfWork.Policies.Count();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public Policy GetPolicyByNumber(string policyNumber)
        {
            if (string.IsNullOrWhiteSpace(policyNumber)) return null;
            return _unitOfWork.Policies.FindOne(p => p.PolicyNumber == policyNumber);
        }

        public IList<Policy> ListActivePolicies(int take = 50)
        {
            return _unitOfWork.Policies.Query()
                .Where(p => p.Status == PolicyStatus.Active)
                .OrderByDescending(p => p.BoundDate)
                .Take(Math.Clamp(take, 1, 500))
                .ToList();
        }

        public int PolicyCount()
        {
            return _unitOfWork.Policies.Count();
        }

        public RiskMarketDetail CreateRisk(OpenBoxCreateRiskRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));
            var sw = Stopwatch.StartNew();

            var existing = _unitOfWork.RiskMarketDetails.FindOne(m => m.SubmissionId == request.SubmissionId);
            if (existing != null)
            {
                return existing;
            }

            var yoa = request.Inception.Year;
            var detail = new RiskMarketDetail
            {
                SubmissionId = request.SubmissionId,
                UwReference = request.SubmissionNumber,
                Yoa = yoa,
                Umr = "B" + request.SubmissionNumber,
                BrokerContact = request.BrokerContact,
                PolicyType = string.IsNullOrWhiteSpace(request.PolicyType) ? "Facultative" : request.PolicyType,
                Mop = string.IsNullOrWhiteSpace(request.Mop) ? "COVERS" : request.Mop,
                PolicyDescription = request.PolicyDescription,
                RiskAppetite = request.RiskAppetite,
                BusinessArea = string.IsNullOrWhiteSpace(request.BusinessArea) ? "PROP" : request.BusinessArea,
                StatCode1 = MapStat(request.BusinessArea),
                NewOrRenewal = string.IsNullOrWhiteSpace(request.NewOrRenewal) ? "N" : request.NewOrRenewal,
                IsDelegatedAuthority = request.IsDelegatedAuthority,
                ExpiryDate = request.Expiry ?? request.Inception.AddYears(1),
                SlipLeader = "Apex",
                Syndicate = "0033",
                WrittenLine = 100m,
                SignedLine = 100m,
                EstSigning = 100m,
                BrokerOrder = 100m,
                NotesType = request.NotesType ?? "UWTR",
                LastTouchedUtc = DateTime.UtcNow
            };

            _unitOfWork.RiskMarketDetails.Add(detail);
            _unitOfWork.SaveChanges();
            sw.Stop();
            LogActivity("OBX", "Out", "CreateRisk", detail.UwReference, "Success", "Wireframe risk created in Open Box mirror.", (int)sw.ElapsedMilliseconds);
            PublishBus("RiskCreated", detail.SubmissionId, detail.UwReference, "{\"action\":\"CreateRisk\"}");
            return detail;
        }

        public RiskMarketDetail GetMarketDetail(int submissionId)
        {
            return _unitOfWork.RiskMarketDetails.FindOne(m => m.SubmissionId == submissionId);
        }

        public IList<RiskMarketDetail> ListRisks(int take = 100)
        {
            take = Math.Clamp(take, 1, 500);
            return _unitOfWork.RiskMarketDetails.Query()
                .OrderByDescending(m => m.LastTouchedUtc)
                .ThenByDescending(m => m.SubmissionId)
                .Take(take)
                .ToList();
        }

        public RiskMarketDetail UpdateUnderwritingFields(int submissionId, OpenBoxUwEditRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));
            var sw = Stopwatch.StartNew();
            var detail = _unitOfWork.RiskMarketDetails.FindOne(m => m.SubmissionId == submissionId);
            if (detail == null)
            {
                detail = new RiskMarketDetail { SubmissionId = submissionId, UwReference = "SUB-" + submissionId };
                _unitOfWork.RiskMarketDetails.Add(detail);
            }

            if (request.BrokerContact != null) detail.BrokerContact = request.BrokerContact;
            if (request.Expiry.HasValue) detail.ExpiryDate = request.Expiry;
            if (request.RiskAppetite != null) detail.RiskAppetite = request.RiskAppetite;
            if (request.IsNonRenewable.HasValue) detail.IsNonRenewable = request.IsNonRenewable.Value;
            if (request.RenewalWarning.HasValue) detail.RenewalWarning = request.RenewalWarning.Value;
            if (request.PolicyDescription != null) detail.PolicyDescription = request.PolicyDescription;
            if (request.PrincipalUw != null) detail.PrincipalUw = request.PrincipalUw;
            if (request.EsgStatus != null) detail.EsgStatus = request.EsgStatus;
            if (request.NotesType != null) detail.NotesType = request.NotesType;
            if (request.EstSigning.HasValue) detail.EstSigning = request.EstSigning;
            if (request.SubStat1 != null) detail.SubStat1 = request.SubStat1;
            if (request.SubStat2 != null) detail.SubStat2 = request.SubStat2;
            if (request.EtradingPlatform != null) detail.EtradingPlatform = request.EtradingPlatform;
            if (request.LicSecondee != null) detail.LicSecondee = request.LicSecondee;
            if (request.DedXs.HasValue) detail.DedXs = request.DedXs;
            if (request.PremRate.HasValue) detail.PremRate = request.PremRate;
            if (request.RiskChange.HasValue) detail.RiskChange = request.RiskChange;
            if (request.TcChange.HasValue) detail.TcChange = request.TcChange;
            if (request.OtherChange.HasValue) detail.OtherChange = request.OtherChange;
            if (request.ModelledLr.HasValue) detail.ModelledLr = request.ModelledLr;
            if (request.FacilityFlag.HasValue) detail.FacilityFlag = request.FacilityFlag.Value;
            if (request.LbsFlag.HasValue) detail.LbsFlag = request.LbsFlag.Value;
            if (request.LicFlag.HasValue) detail.LicFlag = request.LicFlag.Value;
            if (request.LongTermLossRatio.HasValue) detail.LongTermLossRatio = request.LongTermLossRatio;
            if (request.RateAdequacy.HasValue) detail.RateAdequacy = request.RateAdequacy;
            if (request.TechnicalIndex.HasValue) detail.TechnicalIndex = request.TechnicalIndex;
            detail.LastTouchedUtc = DateTime.UtcNow;

            if (request.Inception.HasValue || !string.IsNullOrWhiteSpace(request.Notes) || !string.IsNullOrWhiteSpace(request.RiskStatus))
            {
                var submission = _unitOfWork.Submissions.GetById(submissionId);
                if (submission != null)
                {
                    if (request.Inception.HasValue) submission.RequestedEffectiveDate = request.Inception.Value;
                    if (request.Notes != null) submission.Notes = request.Notes;
                    if (!string.IsNullOrWhiteSpace(request.RiskStatus)
                        && Enum.TryParse(request.RiskStatus, true, out SubmissionStatus status))
                    {
                        submission.Status = status;
                    }
                    _unitOfWork.Submissions.Update(submission);
                }
            }

            _unitOfWork.RiskMarketDetails.Update(detail);
            _unitOfWork.SaveChanges();
            sw.Stop();
            LogActivity("OBX", "Out", "UpdateUwFields", detail.UwReference, "Success", "UW edit posted to Open Box mirror.", (int)sw.ElapsedMilliseconds);
            PublishBus("UwFieldsUpdated", detail.SubmissionId, detail.UwReference, "{\"action\":\"UpdateUwFields\"}");
            return detail;
        }

        private void PublishBus(string eventType, int submissionId, string uwReference, string payloadJson)
        {
            if (_bus == null) return;
            try
            {
                _bus.Publish(new OpenBoxEventMessage
                {
                    EventType = eventType,
                    SubmissionId = submissionId,
                    UwReference = uwReference,
                    OccurredUtc = DateTime.UtcNow,
                    PayloadJson = payloadJson
                });
            }
            catch
            {
                // Bus failures must not roll back OBX writes
            }
        }

        public void LogActivity(string systemName, string direction, string action, string reference, string status, string message, int? elapsedMs = null)
        {
            try
            {
                _unitOfWork.IntegrationActivities.Add(new IntegrationActivity
                {
                    OccurredUtc = DateTime.UtcNow,
                    SystemName = systemName ?? "OBX",
                    Direction = direction ?? "Out",
                    ActionName = action ?? "Unknown",
                    Reference = reference,
                    Status = status ?? "Success",
                    Message = message,
                    ElapsedMs = elapsedMs
                });
                _unitOfWork.SaveChanges();
            }
            catch
            {
                // Do not fail primary write if activity log table is missing.
            }
        }

        private static string MapStat(string businessArea)
        {
            if (string.IsNullOrWhiteSpace(businessArea)) return "PROP";
            var a = businessArea.Trim().ToUpperInvariant();
            if (a.StartsWith("LIAB") || a == "GLIAB") return "LIAB";
            if (a.StartsWith("PI") || a.Contains("PROF")) return "PI";
            if (a.StartsWith("CARGO")) return "CARGO";
            return a.Length <= 6 ? a : a.Substring(0, 6);
        }
    }
}
