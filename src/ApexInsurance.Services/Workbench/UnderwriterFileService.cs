using System;
using System.Collections.Generic;
using System.Linq;
using ApexInsurance.Data;
using ApexInsurance.Domain.Entities;
using ApexInsurance.Services.Dto;
using DomainTaskStatus = ApexInsurance.Domain.Enums.TaskStatus;

namespace ApexInsurance.Services.Workbench
{
    public class UnderwriterFileService : IUnderwriterFileService
    {
        private readonly IUnitOfWork _unitOfWork;

        public UnderwriterFileService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        }

        public UnderwriterFileDto GetBySubmissionId(int submissionId)
        {
            var submission = _unitOfWork.Submissions.GetWithDetails(submissionId);
            if (submission == null)
            {
                return null;
            }

            var quotes = _unitOfWork.Quotes.GetBySubmission(submissionId).ToList();
            var policy = _unitOfWork.Policies.FindOne(p => p.SubmissionId == submissionId);
            var documents = _unitOfWork.Documents.Find(d => d.SubmissionId == submissionId || (policy != null && d.PolicyId == policy.Id))
                .OrderByDescending(d => d.UploadedDate)
                .ToList();
            var tasks = _unitOfWork.WorkflowTasks.Find(t => t.SubmissionId == submissionId
                                                           || (policy != null && t.PolicyId == policy.Id))
                .OrderByDescending(t => t.CreatedDate)
                .ToList();
            var quoteIds = quotes.Select(q => q.Id).ToList();
            var audits = _unitOfWork.AuditLogs.Query()
                .Where(a =>
                    (a.EntityName == "Submission" && a.EntityId == submissionId)
                    || (policy != null && a.EntityName == "Policy" && a.EntityId == policy.Id)
                    || (a.EntityName == "Quote" && quoteIds.Contains(a.EntityId)))
                .OrderByDescending(a => a.Timestamp)
                .Take(50)
                .ToList();

            var claims = policy == null
                ? new List<UnderwriterFileClaimDto>()
                : _unitOfWork.Claims.Find(c => c.PolicyId == policy.Id)
                    .Select(c => MapClaim(c, policy, submission))
                    .ToList();

            var market = _unitOfWork.RiskMarketDetails.FindOne(m => m.SubmissionId == submissionId);
            var activity = BuildActivity(tasks, audits, quotes, documents);
            var paid = claims.Sum(c => c.PaidAmount);
            var reserve = claims.Sum(c => c.ReserveAmount);
            var yoa = market?.Yoa ?? submission.RequestedEffectiveDate.Year;
            var gross = policy?.GrossPremium ?? quotes.Where(q => q.IsSelected).Select(q => q.GrossPremium).DefaultIfEmpty(0).FirstOrDefault();
            var net = policy?.NetPremium ?? quotes.Where(q => q.IsSelected).Select(q => q.NetPremium).DefaultIfEmpty(0).FirstOrDefault();
            var sharePct = (market?.SignedLine ?? 100m) / 100m;

            var associations = new List<UnderwriterFileAssociationDto>
            {
                new UnderwriterFileAssociationDto
                {
                    Kind = "Broker",
                    Label = submission.Broker?.Name ?? "Broker",
                    Description = "Producing broker",
                    Link = submission.BrokerId > 0 ? "#!/brokers/" + submission.BrokerId : null,
                    Yoa = yoa,
                    GrossPremium = gross,
                    NetPremium = net
                },
                new UnderwriterFileAssociationDto
                {
                    Kind = "Insured",
                    Label = submission.Insured?.Name ?? "Insured",
                    Description = "Named insured",
                    Yoa = yoa,
                    Exposure = policy?.SumInsured ?? quotes.FirstOrDefault()?.SumInsured
                }
            };

            if (policy != null)
            {
                associations.Add(new UnderwriterFileAssociationDto
                {
                    Kind = "Policy",
                    Label = policy.PolicyNumber,
                    Description = "Bound policy",
                    Link = "#!/policies/" + policy.Id,
                    Yoa = yoa,
                    GrossPremium = policy.GrossPremium,
                    NetPremium = policy.NetPremium,
                    Exposure = policy.SumInsured
                });
            }

            var sections = quotes.OrderByDescending(q => q.VersionNumber)
                .Select(q => MapSection(q, market, submission, policy, paid, reserve))
                .ToList();

            return new UnderwriterFileDto
            {
                SubmissionId = submission.Id,
                SubmissionNumber = submission.SubmissionNumber,
                Status = submission.Status.ToString(),
                LineOfBusiness = submission.LineOfBusiness.ToString(),
                InsuredName = submission.Insured?.Name,
                BrokerName = submission.Broker?.Name,
                UnderwriterName = submission.Underwriter?.FullName,
                UnderwriterUserId = submission.UnderwriterUserId,
                RequestedEffectiveDate = submission.RequestedEffectiveDate,
                DueDate = submission.DueDate,
                ReceivedDate = submission.ReceivedDate,
                TargetPremium = submission.TargetPremium,
                Notes = submission.Notes,
                PolicyId = policy?.Id,
                PolicyNumber = policy?.PolicyNumber,
                PolicyStatus = policy?.Status.ToString(),
                PolicyEffectiveDate = policy?.EffectiveDate ?? submission.RequestedEffectiveDate,
                PolicyExpiryDate = policy?.ExpiryDate ?? market?.ExpiryDate,
                SumInsured = policy?.SumInsured ?? quotes.FirstOrDefault(q => q.IsSelected)?.SumInsured ?? quotes.OrderByDescending(q => q.VersionNumber).FirstOrDefault()?.SumInsured,
                GrossPremium = gross,
                NetPremium = net,
                Yoa = yoa,
                Umr = market?.Umr,
                BrokerReference = market?.BrokerReference,
                BrokerContact = market?.BrokerContact ?? submission.Broker?.ContactEmail,
                Mop = market?.Mop,
                PolicyDescription = market?.PolicyDescription ?? submission.Notes,
                PolicyType = market?.PolicyType,
                RiskAppetite = market?.RiskAppetite,
                BusinessArea = market?.BusinessArea ?? submission.LineOfBusiness.ToString(),
                Reinsured = market?.Reinsured,
                Domicile = market?.Domicile ?? submission.Insured?.City,
                SlipLeader = market?.SlipLeader,
                UwReference = market?.UwReference ?? submission.SubmissionNumber,
                ExpectedPremium = market?.ExpectedPremium ?? submission.TargetPremium,
                NetSignedPremium = market?.NetSharePremium ?? policy?.NetPremium,
                WeightedTi = market?.WeightedTi,
                WeightedRrm = market?.WeightedRrm,
                LongTermLossRatio = market?.LongTermLossRatio,
                RateAdequacy = market?.RateAdequacy,
                EsgStatus = market?.EsgStatus,
                NotesType = market?.NotesType ?? "UWTR",
                IsDelegatedAuthority = market?.IsDelegatedAuthority ?? false,
                IsNonRenewable = market?.IsNonRenewable ?? false,
                PremiumSchedule = quotes.Select(q => new UnderwriterFilePremiumScheduleDto
                {
                    UwReference = q.QuoteNumber,
                    Inception = submission.RequestedEffectiveDate,
                    Expiry = market?.ExpiryDate ?? policy?.ExpiryDate,
                    Egpi = q.GrossPremium,
                    Commission = q.CommissionAmount,
                    Brokerage = q.CommissionAmount * 0.5m,
                    Pc = q.NetPremium,
                    PcPaidToDate = 0,
                    Ilr = claims.Count == 0 ? 0 : (paid + reserve) / Math.Max(q.GrossPremium, 1m)
                }).ToList(),
                Sections = sections,
                Documents = documents.Select(d => MapDocument(d)).ToList(),
                ActivityLog = activity.OrderByDescending(a => a.CreatedDate).ToList(),
                Claims = claims,
                Associations = associations,
                Performance = new UnderwriterFilePerformanceDto
                {
                    GrossPremium = gross,
                    NetPremium = net,
                    PaidClaims = paid,
                    OutstandingReserve = reserve,
                    IncurredClaims = paid + reserve,
                    LineShare = new List<UnderwriterFilePerformanceLineDto>
                    {
                        new UnderwriterFilePerformanceLineDto
                        {
                            Yoa = yoa,
                            Ccy = "GBP",
                            GrossPremium = Math.Round(gross * sharePct, 2),
                            NetPremium = Math.Round(net * sharePct, 2),
                            PaidClaims = Math.Round(paid * sharePct, 2),
                            OutstandingReserve = Math.Round(reserve * sharePct, 2),
                            IncurredClaims = Math.Round((paid + reserve) * sharePct, 2),
                            LossRatio = net > 0 ? Math.Round((paid + reserve) / net, 4) : 0
                        }
                    },
                    FullOrder = new List<UnderwriterFilePerformanceLineDto>
                    {
                        new UnderwriterFilePerformanceLineDto
                        {
                            Yoa = yoa,
                            Ccy = "GBP",
                            GrossPremium = gross,
                            NetPremium = net,
                            PaidClaims = paid,
                            OutstandingReserve = reserve,
                            IncurredClaims = paid + reserve,
                            LossRatio = net > 0 ? Math.Round((paid + reserve) / net, 4) : 0
                        }
                    }
                }
            };
        }

        private static UnderwriterFileClaimDto MapClaim(Claim c, Policy policy, Submission submission)
        {
            var incurred = c.PaidAmount + c.ReserveAmount;
            var np = policy?.NetPremium ?? 0;
            return new UnderwriterFileClaimDto
            {
                Id = c.Id,
                ClaimNumber = c.ClaimNumber,
                Status = c.Status.ToString(),
                DateOfLoss = c.DateOfLoss,
                DateOfNotification = c.DateOfLoss.AddDays(5),
                ReserveAmount = c.ReserveAmount,
                PaidAmount = c.PaidAmount,
                Ucr = "UCR-" + c.ClaimNumber,
                Claimant = submission?.Insured?.Name ?? "Insured",
                Location = submission?.Insured?.City ?? "London",
                Ccy = "GBP",
                Ptd = c.PaidAmount,
                ApexShareNp = Math.Round(np * 0.25m, 2),
                Ilr = np > 0 ? Math.Round(incurred / np, 4) : 0,
                Cap = Math.Round(incurred * 1.1m, 2),
                Exposure = policy?.SumInsured
            };
        }

        private static UnderwriterFileDocumentDto MapDocument(Document d)
        {
            var meta = ParseDocMeta(d.Notes);
            return new UnderwriterFileDocumentDto
            {
                Id = d.Id,
                FileName = d.FileName,
                DocumentType = d.DocumentType.ToString(),
                VersionNumber = d.VersionNumber,
                Notes = meta.Notes,
                UploadedDate = d.UploadedDate,
                ContentType = d.ContentType,
                Author = meta.Author,
                EndorsementNo = meta.EndorsementNo,
                DisplayName = meta.DisplayName ?? d.FileName,
                ExternalReference = meta.ExternalReference
            };
        }

        private List<UnderwriterFileActivityDto> BuildActivity(
            List<WorkflowTask> tasks,
            List<AuditLog> audits,
            List<Quote> quotes,
            List<Document> documents)
        {
            var activity = new List<UnderwriterFileActivityDto>();
            foreach (var t in tasks)
            {
                var owner = _unitOfWork.Users.GetById(t.AssignedToUserId);
                var completedBy = t.Status == DomainTaskStatus.Completed ? owner : null;
                var doc = documents.FirstOrDefault();
                activity.Add(new UnderwriterFileActivityDto
                {
                    ActivityType = InferTaskType(t.Title),
                    Title = t.Title,
                    Detail = StripCommentTrail(t.Description),
                    OwnerName = owner?.FullName,
                    CompletedByName = completedBy?.FullName,
                    CreatedDate = t.CreatedDate,
                    CompletedDate = t.CompletedDate,
                    Status = t.Status.ToString(),
                    RelatedEntityId = t.Id,
                    DocInfo = doc != null ? doc.FileName : null,
                    LloydsPin = "PIN-" + t.Id.ToString("D5"),
                    Reference = "TASK-" + t.Id
                });
            }

            foreach (var a in audits)
            {
                var user = a.UserId.HasValue ? _unitOfWork.Users.GetById(a.UserId.Value) : null;
                activity.Add(new UnderwriterFileActivityDto
                {
                    ActivityType = a.Action ?? "Audit",
                    Title = (a.EntityName ?? "Entity") + " #" + a.EntityId,
                    Detail = a.Details,
                    OwnerName = user?.FullName,
                    CreatedDate = a.Timestamp,
                    Status = "Logged",
                    RelatedEntityId = a.EntityId,
                    Reference = a.EntityName + "-" + a.EntityId
                });
            }

            foreach (var q in quotes.Where(q => q.IsReferralRequired))
            {
                activity.Add(new UnderwriterFileActivityDto
                {
                    ActivityType = "Referral",
                    Title = q.QuoteNumber,
                    Detail = q.ReferralReason,
                    CreatedDate = q.CreatedDate,
                    Status = q.ReferralDecision.ToString(),
                    RelatedEntityId = q.Id,
                    Reference = q.QuoteNumber
                });
            }

            return activity;
        }

        private static UnderwriterFileSectionDto MapSection(
            Quote q,
            RiskMarketDetail market,
            Submission submission,
            Policy policy,
            decimal paid,
            decimal reserve)
        {
            var rrm = market?.WeightedRrm ?? 1.0m;
            var ti = market?.TechnicalIndex ?? q.GrossPremium * 0.95m;
            var dedXs = market?.DedXs ?? q.Deductible;
            var premRate = market?.PremRate ?? (q.SumInsured > 0 ? Math.Round(q.GrossPremium / q.SumInsured * 100m, 4) : 0);
            var riskChange = market?.RiskChange ?? 0.5m;
            var tc = market?.TcChange ?? 0.25m;
            var other = market?.OtherChange ?? 0.1m;
            var total = rrm + riskChange + tc + other;

            var section = new UnderwriterFileSectionDto
            {
                QuoteId = q.Id,
                QuoteNumber = q.QuoteNumber,
                VersionNumber = q.VersionNumber,
                IsSelected = q.IsSelected,
                SumInsured = q.SumInsured,
                LimitOfIndemnity = q.LimitOfIndemnity,
                Deductible = q.Deductible,
                GrossPremium = q.GrossPremium,
                NetPremium = q.NetPremium,
                CommissionAmount = q.CommissionAmount,
                IsReferralRequired = q.IsReferralRequired,
                ReferralReason = q.ReferralReason,
                ReferralDecision = q.ReferralDecision.ToString(),
                BusinessArea = market?.BusinessArea,
                StatCode1 = market?.StatCode1,
                StatCode2 = market?.StatCode2,
                SubStat1 = market?.SubStat1,
                SubStat2 = market?.SubStat2 ?? market?.StatCode2,
                Syndicate = market?.Syndicate,
                WrittenLine = market?.WrittenLine,
                SignedLine = market?.SignedLine,
                EstSigning = market?.EstSigning,
                ActSigning = market?.ActSigning,
                BrokerOrder = market?.BrokerOrder,
                TechnicalIndex = ti,
                RiskCode = market?.RiskCode ?? "B",
                Inception = submission.RequestedEffectiveDate,
                Expiry = market?.ExpiryDate ?? policy?.ExpiryDate,
                UwPrincipal = market?.PrincipalUw ?? submission.Underwriter?.FullName,
                GomWind = market?.BusinessArea == "UPSEN" ? "Y" : "N",
                Lbs = market?.LbsFlag ?? true,
                Lic = market?.LicFlag ?? market?.IsDelegatedAuthority == true,
                LicRisk = false,
                Facility = market?.FacilityFlag ?? (market?.PolicyType ?? "").IndexOf("Line", StringComparison.OrdinalIgnoreCase) >= 0,
                Exposure = q.SumInsured,
                Rrm = rrm,
                DedXs = dedXs,
                PremRate = premRate,
                RiskChange = riskChange,
                TcChange = tc,
                OtherChange = other,
                ModelledLr = market?.ModelledLr ?? market?.LongTermLossRatio ?? 0.55m,
                Basis = "Risks Attaching",
                LicSecondee = market?.LicSecondee ?? "—",
                EtradingPlatform = market?.EtradingPlatform ?? "Placing Platform",
                Ccy = "GBP",
                FacRi = false,
                KpiTotal = total
            };

            section.LimitsRows = new List<UnderwriterFileGridRowDto>
            {
                new UnderwriterFileGridRowDto
                {
                    Col1 = "Any One Occurrence",
                    Col2 = "Limit",
                    Col3 = "Risks Attaching",
                    Col4 = "100%",
                    Col5 = q.LimitOfIndemnity.ToString("0"),
                    Col6 = q.Deductible.ToString("0"),
                    Col7 = q.SumInsured.ToString("0"),
                    Col8 = "Section limit"
                }
            };
            section.PremiumRows = new List<UnderwriterFileGridRowDto>
            {
                new UnderwriterFileGridRowDto
                {
                    Col1 = "EGPI",
                    Col2 = "Annual",
                    Col3 = "GBP",
                    Col4 = q.GrossPremium.ToString("0.00"),
                    Col5 = q.NetPremium.ToString("0.00"),
                    Col6 = q.CommissionAmount.ToString("0.00"),
                    Col7 = "0",
                    Col8 = q.QuoteNumber
                }
            };
            section.PerformanceRows = new List<UnderwriterFileGridRowDto>
            {
                new UnderwriterFileGridRowDto
                {
                    Col1 = "Live",
                    Col2 = (market?.Yoa ?? submission.RequestedEffectiveDate.Year).ToString(),
                    Col3 = ti.ToString("0.00"),
                    Col4 = q.NetPremium.ToString("0.00"),
                    Col5 = "0.45",
                    Col6 = (q.NetPremium > 0 ? ((paid + reserve) / q.NetPremium).ToString("0.00") : "0")
                }
            };
            section.BureauRows = new List<UnderwriterFileGridRowDto>
            {
                new UnderwriterFileGridRowDto
                {
                    Col1 = market?.Umr ?? ("B" + submission.SubmissionNumber),
                    Col2 = "LP-" + q.Id.ToString("D5"),
                    Col3 = "Signed",
                    Col4 = "Bureau mirror row"
                }
            };
            section.DeductionRows = new List<UnderwriterFileGridRowDto>
            {
                new UnderwriterFileGridRowDto { Col1 = "Brokerage", Col2 = "10", Col3 = (q.GrossPremium * 0.10m).ToString("0.00"), Col4 = "GBP" },
                new UnderwriterFileGridRowDto { Col1 = "Tax", Col2 = "2", Col3 = (q.GrossPremium * 0.02m).ToString("0.00"), Col4 = "GBP" }
            };
            section.OutwardsRiRows = new List<UnderwriterFileGridRowDto>
            {
                new UnderwriterFileGridRowDto { Col1 = "Quota Share", Col2 = "Apex RI", Col3 = "25", Col4 = (q.NetPremium * 0.25m).ToString("0.00"), Col5 = (q.SumInsured * 0.25m).ToString("0") }
            };
            section.DeclarationRows = new List<UnderwriterFileGridRowDto>
            {
                new UnderwriterFileGridRowDto
                {
                    Col1 = submission.RequestedEffectiveDate.ToString("dd/MM/yyyy"),
                    Col2 = "Q1",
                    Col3 = (q.GrossPremium / 4m).ToString("0.00"),
                    Col4 = "Declared"
                }
            };
            return section;
        }

        private static string InferTaskType(string title)
        {
            if (string.IsNullOrWhiteSpace(title)) return "Task";
            if (title.StartsWith("[", StringComparison.Ordinal) && title.Contains("]"))
            {
                var end = title.IndexOf(']');
                return title.Substring(1, end - 1);
            }
            return "Task";
        }

        private static string StripCommentTrail(string description)
        {
            if (string.IsNullOrEmpty(description)) return description;
            var idx = description.IndexOf("\n---COMMENT---\n", StringComparison.Ordinal);
            return idx >= 0 ? description.Substring(0, idx) : description;
        }

        private sealed class DocMeta
        {
            public string Author { get; set; }
            public string EndorsementNo { get; set; }
            public string DisplayName { get; set; }
            public string ExternalReference { get; set; }
            public string Notes { get; set; }
        }

        private static DocMeta ParseDocMeta(string notes)
        {
            var meta = new DocMeta { Notes = notes };
            if (string.IsNullOrWhiteSpace(notes) || !notes.StartsWith("META|", StringComparison.Ordinal))
            {
                return meta;
            }

            var parts = notes.Split('|');
            foreach (var part in parts.Skip(1))
            {
                var kv = part.Split(new[] { '=' }, 2);
                if (kv.Length != 2) continue;
                switch (kv[0])
                {
                    case "author": meta.Author = kv[1]; break;
                    case "endt": meta.EndorsementNo = kv[1]; break;
                    case "name": meta.DisplayName = kv[1]; break;
                    case "ref": meta.ExternalReference = kv[1]; break;
                    case "notes": meta.Notes = kv[1]; break;
                }
            }
            return meta;
        }
    }
}
