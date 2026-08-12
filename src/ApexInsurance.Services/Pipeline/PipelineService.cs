using System;
using System.Collections.Generic;
using System.Linq;
using ApexInsurance.Data;
using ApexInsurance.Domain.Entities;
using ApexInsurance.Domain.Enums;
using ApexInsurance.Services.Dto;
using DomainTaskStatus = ApexInsurance.Domain.Enums.TaskStatus;

namespace ApexInsurance.Services.Pipeline
{
    public class PipelineService : IPipelineService
    {
        private readonly IUnitOfWork _unitOfWork;

        public PipelineService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        }

        public PipelineSummaryDto GetSummary(int? underwriterId = null)
        {
            var submissions = _unitOfWork.Submissions.Query();
            if (underwriterId.HasValue)
            {
                submissions = submissions.Where(s => s.UnderwriterUserId == underwriterId || s.UnderwriterUserId == null);
            }

            var openStatuses = new[]
            {
                SubmissionStatus.Received,
                SubmissionStatus.Triaged,
                SubmissionStatus.Quoted,
                SubmissionStatus.Referred
            };

            var today = DateTime.UtcNow.Date;
            var tomorrow = today.AddDays(1);
            var recentFrom = today.AddDays(-7);

            return new PipelineSummaryDto
            {
                Upcoming = submissions.Count(s => openStatuses.Contains(s.Status)),
                Bound = _unitOfWork.Policies.Query().Count(p => p.Status == PolicyStatus.Active || p.Status == PolicyStatus.PendingRenewal),
                NtuDeclined = submissions.Count(s => s.Status == SubmissionStatus.Declined || s.Status == SubmissionStatus.NotTakenUp),
                DayFile = DayFileSubmissionIds(today, tomorrow).Count,
                Queries = _unitOfWork.WorkflowTasks.Query()
                    .Where(t => t.Status != DomainTaskStatus.Completed && t.Status != DomainTaskStatus.Cancelled)
                    .ToList()
                    .Count(IsQueryTask),
                Referrals = _unitOfWork.Quotes.Query()
                    .Count(q => q.IsReferralRequired && q.ReferralDecision == ReferralDecision.Pending),
                OpenTasks = _unitOfWork.WorkflowTasks.Query()
                    .Count(t => t.Status != DomainTaskStatus.Completed && t.Status != DomainTaskStatus.Cancelled
                                && (!underwriterId.HasValue || t.AssignedToUserId == underwriterId.Value)),
                DelegatedAuthority = _unitOfWork.RiskMarketDetails.Query().Count(m => m.IsDelegatedAuthority),
                RecentActivity = submissions.Count(s => s.ReceivedDate >= recentFrom || (s.AssignedDate != null && s.AssignedDate >= recentFrom)),
                EPlacement = _unitOfWork.Quotes.Query().Count(q => q.IsSelected && !q.IsReferralRequired)
            };
        }

        public IList<PipelineRowDto> GetBucket(string bucket, string search = null, string lineOfBusiness = null, int? underwriterId = null, int page = 1, int pageSize = 50)
        {
            bucket = (bucket ?? "upcoming").Trim().ToLowerInvariant();
            page = Math.Max(page, 1);
            pageSize = Math.Clamp(pageSize, 1, 200);

            IEnumerable<PipelineRowDto> rows = bucket switch
            {
                "bound" => BoundRows(),
                "ntu" or "ntu-declined" or "declined" => NtuRows(),
                "day-file" or "dayfile" => DayFileRows(),
                "queries" => QueryRows(),
                "referrals" => ReferralRows(),
                "da" or "delegated" or "delegated-authority" => DaRows(),
                "recent" or "recent-activity" => RecentRows(),
                _ => UpcomingRows()
            };

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim().ToLowerInvariant();
                rows = rows.Where(r =>
                    (r.AccountName ?? string.Empty).ToLowerInvariant().Contains(term)
                    || (r.Reference ?? string.Empty).ToLowerInvariant().Contains(term)
                    || (r.BrokerName ?? string.Empty).ToLowerInvariant().Contains(term)
                    || (r.Description ?? string.Empty).ToLowerInvariant().Contains(term)
                    || (r.BusinessArea ?? string.Empty).ToLowerInvariant().Contains(term));
            }

            if (!string.IsNullOrWhiteSpace(lineOfBusiness))
            {
                rows = rows.Where(r =>
                    string.Equals(r.LineOfBusiness, lineOfBusiness, StringComparison.OrdinalIgnoreCase)
                    || string.Equals(r.BusinessArea, lineOfBusiness, StringComparison.OrdinalIgnoreCase));
            }

            if (underwriterId.HasValue)
            {
                var uw = _unitOfWork.Users.GetById(underwriterId.Value);
                var name = uw?.FullName;
                if (!string.IsNullOrWhiteSpace(name))
                {
                    rows = rows.Where(r => string.Equals(r.UnderwriterName, name, StringComparison.OrdinalIgnoreCase));
                }
            }

            return rows.Skip((page - 1) * pageSize).Take(pageSize).ToList();
        }

        private RiskMarketDetail Market(int submissionId)
        {
            return _unitOfWork.RiskMarketDetails.FindOne(m => m.SubmissionId == submissionId);
        }

        private void ApplyMarket(PipelineRowDto row, RiskMarketDetail m, Submission detail)
        {
            if (m == null)
            {
                row.BusinessArea = detail?.LineOfBusiness.ToString();
                row.NewOrRenewal = detail?.RenewedFromPolicyId != null ? "R" : "N";
                return;
            }
            row.Reference = m.UwReference ?? row.Reference;
            row.BusinessArea = m.BusinessArea;
            row.StatCode1 = m.StatCode1;
            row.Mop = m.Mop;
            row.NewOrRenewal = m.NewOrRenewal;
            row.Description = m.PolicyDescription ?? row.Description;
            row.BrokerContact = m.BrokerContact ?? row.BrokerContact;
            row.Expiry = m.ExpiryDate ?? row.Expiry;
            row.NetSharePremium = m.NetSharePremium;
            row.IsDelegatedAuthority = m.IsDelegatedAuthority;
            row.Yoa = m.Yoa;
            row.IsNonRenewable = m.IsNonRenewable;
            if (m.ExpectedPremium.HasValue) row.Premium = m.ExpectedPremium;
        }

        private void ApplyTaskBadges(PipelineRowDto row, int? submissionId)
        {
            if (!submissionId.HasValue) return;
            var tasks = _unitOfWork.WorkflowTasks.Find(t => t.SubmissionId == submissionId.Value).ToList();
            row.HasSecondSight = tasks.Any(t => (t.Title ?? "").IndexOf("Second", StringComparison.OrdinalIgnoreCase) >= 0);
            row.HasFrontSheet = tasks.Any(t => (t.Title ?? "").IndexOf("Front", StringComparison.OrdinalIgnoreCase) >= 0);
            row.HasModelling = tasks.Any(t => (t.Title ?? "").IndexOf("Model", StringComparison.OrdinalIgnoreCase) >= 0);
        }

        private IEnumerable<PipelineRowDto> UpcomingRows()
        {
            var open = new[]
            {
                SubmissionStatus.Received,
                SubmissionStatus.Triaged,
                SubmissionStatus.Quoted,
                SubmissionStatus.Referred
            };

            return _unitOfWork.Submissions.Query()
                .Where(s => open.Contains(s.Status))
                .OrderByDescending(s => s.ReceivedDate)
                .ToList()
                .Select(s =>
                {
                    var detail = _unitOfWork.Submissions.GetWithDetails(s.Id) ?? s;
                    var row = new PipelineRowDto
                    {
                        Bucket = "upcoming",
                        RowType = "submission",
                        EntityId = s.Id,
                        SubmissionId = s.Id,
                        Reference = detail.SubmissionNumber,
                        AccountName = detail.Insured?.Name,
                        LineOfBusiness = detail.LineOfBusiness.ToString(),
                        Status = detail.Status.ToString(),
                        UnderwriterName = detail.Underwriter?.FullName,
                        BrokerName = detail.Broker?.Name,
                        BrokerContact = detail.Broker?.ContactEmail,
                        Inception = detail.RequestedEffectiveDate,
                        Premium = detail.TargetPremium,
                        Description = detail.Notes,
                        IsReferral = detail.Status == SubmissionStatus.Referred,
                        IsOverdue = detail.DueDate.HasValue && detail.DueDate.Value.Date < DateTime.UtcNow.Date
                    };
                    ApplyMarket(row, Market(s.Id), detail);
                    ApplyTaskBadges(row, s.Id);
                    return row;
                });
        }

        private IEnumerable<PipelineRowDto> BoundRows()
        {
            return _unitOfWork.Policies.Query()
                .Where(p => p.Status == PolicyStatus.Active || p.Status == PolicyStatus.PendingRenewal)
                .OrderByDescending(p => p.BoundDate)
                .ToList()
                .Select(p =>
                {
                    var full = _unitOfWork.Policies.GetById(p.Id) ?? p;
                    var submission = full.SubmissionId > 0 ? _unitOfWork.Submissions.GetWithDetails(full.SubmissionId) : null;
                    var row = new PipelineRowDto
                    {
                        Bucket = "bound",
                        RowType = "policy",
                        EntityId = full.Id,
                        PolicyId = full.Id,
                        SubmissionId = full.SubmissionId > 0 ? full.SubmissionId : (int?)null,
                        Reference = full.PolicyNumber,
                        AccountName = submission?.Insured?.Name,
                        LineOfBusiness = full.LineOfBusiness.ToString(),
                        Status = full.Status.ToString(),
                        UnderwriterName = submission?.Underwriter?.FullName,
                        BrokerName = submission?.Broker?.Name ?? full.Broker?.Name,
                        BrokerContact = submission?.Broker?.ContactEmail ?? full.Broker?.ContactEmail,
                        Inception = full.EffectiveDate,
                        Expiry = full.ExpiryDate,
                        Premium = full.GrossPremium,
                        NetPremium = full.NetPremium,
                        Exposure = full.SumInsured,
                        Description = "Bound policy",
                        IsOverdue = full.ExpiryDate.Date <= DateTime.UtcNow.Date.AddDays(60)
                    };
                    if (full.SubmissionId > 0) ApplyMarket(row, Market(full.SubmissionId), submission);
                    ApplyTaskBadges(row, full.SubmissionId > 0 ? full.SubmissionId : (int?)null);
                    return row;
                });
        }

        private IEnumerable<PipelineRowDto> NtuRows()
        {
            return _unitOfWork.Submissions.Query()
                .Where(s => s.Status == SubmissionStatus.Declined || s.Status == SubmissionStatus.NotTakenUp)
                .OrderByDescending(s => s.ReceivedDate)
                .ToList()
                .Select(s =>
                {
                    var detail = _unitOfWork.Submissions.GetWithDetails(s.Id) ?? s;
                    var row = new PipelineRowDto
                    {
                        Bucket = "ntu",
                        RowType = "submission",
                        EntityId = s.Id,
                        SubmissionId = s.Id,
                        Reference = detail.SubmissionNumber,
                        AccountName = detail.Insured?.Name,
                        LineOfBusiness = detail.LineOfBusiness.ToString(),
                        Status = detail.Status.ToString(),
                        UnderwriterName = detail.Underwriter?.FullName,
                        BrokerName = detail.Broker?.Name,
                        BrokerContact = detail.Broker?.ContactEmail,
                        Inception = detail.RequestedEffectiveDate,
                        Premium = detail.TargetPremium,
                        Description = detail.Notes
                    };
                    ApplyMarket(row, Market(s.Id), detail);
                    return row;
                });
        }

        private IEnumerable<PipelineRowDto> DaRows()
        {
            var daIds = _unitOfWork.RiskMarketDetails.Query()
                .Where(m => m.IsDelegatedAuthority)
                .Select(m => m.SubmissionId)
                .ToList();

            return _unitOfWork.Submissions.Query()
                .Where(s => daIds.Contains(s.Id))
                .OrderByDescending(s => s.ReceivedDate)
                .ToList()
                .Select(s =>
                {
                    var detail = _unitOfWork.Submissions.GetWithDetails(s.Id) ?? s;
                    var row = new PipelineRowDto
                    {
                        Bucket = "da",
                        RowType = "submission",
                        EntityId = s.Id,
                        SubmissionId = s.Id,
                        Reference = detail.SubmissionNumber,
                        AccountName = detail.Insured?.Name,
                        LineOfBusiness = detail.LineOfBusiness.ToString(),
                        Status = detail.Status.ToString(),
                        UnderwriterName = detail.Underwriter?.FullName,
                        BrokerName = detail.Broker?.Name,
                        Inception = detail.RequestedEffectiveDate,
                        Premium = detail.TargetPremium,
                        Description = detail.Notes,
                        IsDelegatedAuthority = true
                    };
                    ApplyMarket(row, Market(s.Id), detail);
                    return row;
                });
        }

        private IEnumerable<PipelineRowDto> RecentRows()
        {
            var from = DateTime.UtcNow.Date.AddDays(-7);
            return _unitOfWork.Submissions.Query()
                .Where(s => s.ReceivedDate >= from || (s.AssignedDate != null && s.AssignedDate >= from))
                .OrderByDescending(s => s.ReceivedDate)
                .ToList()
                .Select(s =>
                {
                    var detail = _unitOfWork.Submissions.GetWithDetails(s.Id) ?? s;
                    var row = new PipelineRowDto
                    {
                        Bucket = "recent",
                        RowType = "submission",
                        EntityId = s.Id,
                        SubmissionId = s.Id,
                        Reference = detail.SubmissionNumber,
                        AccountName = detail.Insured?.Name,
                        LineOfBusiness = detail.LineOfBusiness.ToString(),
                        Status = detail.Status.ToString(),
                        UnderwriterName = detail.Underwriter?.FullName,
                        BrokerName = detail.Broker?.Name,
                        Inception = detail.RequestedEffectiveDate,
                        Premium = detail.TargetPremium,
                        Description = detail.Notes
                    };
                    ApplyMarket(row, Market(s.Id), detail);
                    return row;
                });
        }

        private static bool IsQueryTask(WorkflowTask t)
        {
            if (string.Equals(t.TaskType, "Query", StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }
            var title = t.Title ?? string.Empty;
            return title.StartsWith("[Query]", StringComparison.OrdinalIgnoreCase)
                   || title.StartsWith("Query:", StringComparison.OrdinalIgnoreCase);
        }

        private List<int> DayFileSubmissionIds(DateTime today, DateTime tomorrow)
        {
            var ids = new HashSet<int>();

            foreach (var t in _unitOfWork.WorkflowTasks.Query()
                         .Where(t => t.SubmissionId != null
                                     && ((t.CompletedDate >= today && t.CompletedDate < tomorrow)
                                         || (t.CreatedDate >= today && t.CreatedDate < tomorrow)))
                         .Select(t => t.SubmissionId.Value)
                         .ToList())
            {
                ids.Add(t);
            }

            foreach (var m in _unitOfWork.RiskMarketDetails.Query()
                         .Where(m => m.LastTouchedUtc != null && m.LastTouchedUtc >= today && m.LastTouchedUtc < tomorrow)
                         .Select(m => m.SubmissionId)
                         .ToList())
            {
                ids.Add(m);
            }

            foreach (var s in _unitOfWork.Submissions.Query()
                         .Where(s => (s.AssignedDate != null && s.AssignedDate >= today && s.AssignedDate < tomorrow)
                                     || (s.ReceivedDate >= today && s.ReceivedDate < tomorrow))
                         .Select(s => s.Id)
                         .ToList())
            {
                ids.Add(s);
            }

            foreach (var a in _unitOfWork.AuditLogs.Query()
                         .Where(a => a.EntityName == "Submission"
                                     && a.Timestamp >= today && a.Timestamp < tomorrow)
                         .Select(a => a.EntityId)
                         .ToList())
            {
                ids.Add(a);
            }

            return ids.ToList();
        }

        private IEnumerable<PipelineRowDto> DayFileRows()
        {
            var today = DateTime.UtcNow.Date;
            var tomorrow = today.AddDays(1);
            var ids = DayFileSubmissionIds(today, tomorrow);
            if (ids.Count == 0)
            {
                return Enumerable.Empty<PipelineRowDto>();
            }

            return _unitOfWork.Submissions.Query()
                .Where(s => ids.Contains(s.Id))
                .OrderByDescending(s => s.ReceivedDate)
                .ToList()
                .Select(s =>
                {
                    var detail = _unitOfWork.Submissions.GetWithDetails(s.Id) ?? s;
                    var row = new PipelineRowDto
                    {
                        Bucket = "day-file",
                        RowType = "submission",
                        EntityId = s.Id,
                        SubmissionId = s.Id,
                        Reference = detail.SubmissionNumber,
                        AccountName = detail.Insured?.Name,
                        LineOfBusiness = detail.LineOfBusiness.ToString(),
                        Status = detail.Status.ToString(),
                        UnderwriterName = detail.Underwriter?.FullName,
                        BrokerName = detail.Broker?.Name,
                        BrokerContact = detail.Broker?.ContactEmail,
                        Inception = detail.RequestedEffectiveDate,
                        Premium = detail.TargetPremium,
                        Description = detail.Notes
                    };
                    ApplyMarket(row, Market(s.Id), detail);
                    ApplyTaskBadges(row, s.Id);
                    return row;
                });
        }

        private IEnumerable<PipelineRowDto> QueryRows()
        {
            return _unitOfWork.WorkflowTasks.Query()
                .Where(t => t.Status != DomainTaskStatus.Completed && t.Status != DomainTaskStatus.Cancelled)
                .OrderBy(t => t.DueDate)
                .ToList()
                .Where(IsQueryTask)
                .Select(t =>
                {
                    var assignee = _unitOfWork.Users.GetById(t.AssignedToUserId);
                    var submission = t.SubmissionId.HasValue
                        ? _unitOfWork.Submissions.GetWithDetails(t.SubmissionId.Value)
                        : null;
                    return new PipelineRowDto
                    {
                        Bucket = "queries",
                        RowType = "task",
                        EntityId = t.Id,
                        SubmissionId = t.SubmissionId,
                        PolicyId = t.PolicyId,
                        Reference = "QRY-" + t.Id,
                        AccountName = submission?.Insured?.Name ?? t.Title,
                        LineOfBusiness = submission?.LineOfBusiness.ToString(),
                        Status = t.Status.ToString(),
                        UnderwriterName = assignee?.FullName,
                        BrokerName = submission?.Broker?.Name,
                        Inception = t.DueDate,
                        Description = t.Title + (string.IsNullOrWhiteSpace(t.Description) ? "" : " — " + t.Description),
                        IsOverdue = t.DueDate.Date < DateTime.UtcNow.Date
                    };
                });
        }

        private IEnumerable<PipelineRowDto> ReferralRows()
        {
            return _unitOfWork.Quotes.GetReferralQueue()
                .Select(q => new PipelineRowDto
                {
                    Bucket = "referrals",
                    RowType = "quote",
                    EntityId = q.Id,
                    SubmissionId = q.SubmissionId,
                    Reference = q.QuoteNumber,
                    AccountName = q.Submission?.Insured?.Name,
                    LineOfBusiness = q.Submission?.LineOfBusiness.ToString(),
                    Status = q.ReferralDecision.ToString(),
                    UnderwriterName = q.Submission?.Underwriter?.FullName,
                    BrokerName = q.Submission?.Broker?.Name,
                    Inception = q.CreatedDate,
                    Premium = q.GrossPremium,
                    Description = q.ReferralReason,
                    IsReferral = true
                });
        }
    }
}
