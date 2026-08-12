using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using ApexInsurance.Data;
using ApexInsurance.Domain.Enums;
using ApexInsurance.Services.Dto;

namespace ApexInsurance.Services.Reporting
{
    public class ReportingService : IReportingService
    {
        private const string PremiumTargetParameterKey = "MonthlyPremiumTarget";
        private const decimal DefaultMonthlyTarget = 250000m;

        private readonly IUnitOfWork _unitOfWork;

        public ReportingService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        }

        public IEnumerable<PremiumVsTargetRow> PremiumVsTarget(DateTime fromDate, DateTime toDate)
        {
            var target = GetMonthlyTarget();
            var rows = new List<PremiumVsTargetRow>();

            var cursor = new DateTime(fromDate.Year, fromDate.Month, 1);
            var end = new DateTime(toDate.Year, toDate.Month, 1);

            while (cursor <= end)
            {
                var monthStart = cursor;
                var monthEnd = cursor.AddMonths(1).AddTicks(-1);

                var written = _unitOfWork.Policies.Query()
                    .Where(p => p.BoundDate >= monthStart && p.BoundDate <= monthEnd)
                    .Sum(p => (decimal?)p.GrossPremium) ?? 0m;

                rows.Add(new PremiumVsTargetRow
                {
                    Year = cursor.Year,
                    Month = cursor.Month,
                    PeriodLabel = cursor.ToString("MMM yyyy", CultureInfo.InvariantCulture),
                    PremiumWritten = written,
                    Target = target,
                    VariancePercent = target > 0 ? Math.Round((written - target) / target * 100m, 1) : 0m
                });

                cursor = cursor.AddMonths(1);
            }

            return rows;
        }

        public IEnumerable<BrokerLeagueRow> BrokerLeague(DateTime fromDate, DateTime toDate, int topN = 20)
        {
            var performance = _unitOfWork.Dashboard.GetBrokerPerformance(fromDate, toDate).ToList();

            return performance
                .OrderByDescending(p => p.GrossWrittenPremium)
                .Take(topN)
                .Select((p, index) => new BrokerLeagueRow
                {
                    Rank = index + 1,
                    BrokerId = p.BrokerId,
                    BrokerName = p.BrokerName,
                    SubmissionCount = p.SubmissionCount,
                    BoundCount = p.BoundCount,
                    HitRatio = p.SubmissionCount > 0 ? Math.Round((decimal)p.BoundCount / p.SubmissionCount * 100m, 1) : 0m,
                    GrossWrittenPremium = p.GrossWrittenPremium
                })
                .ToList();
        }

        public IEnumerable<PipelineAgingRow> PipelineAging()
        {
            var openStatuses = new[]
            {
                SubmissionStatus.Received, SubmissionStatus.Triaged,
                SubmissionStatus.Quoted, SubmissionStatus.Referred
            };

            var now = DateTime.UtcNow;
            var open = _unitOfWork.Submissions.Query()
                .Where(s => openStatuses.Contains(s.Status))
                .Select(s => new { s.Status, s.CreatedDate })
                .ToList();

            return open
                .Select(s => new { s.Status, AgeDays = (now - s.CreatedDate).TotalDays })
                .GroupBy(s => new { s.Status, Bucket = GetAgeBucket(s.AgeDays) })
                .Select(g => new PipelineAgingRow
                {
                    Status = g.Key.Status,
                    AgeBucket = g.Key.Bucket,
                    Count = g.Count()
                })
                .OrderBy(r => r.Status)
                .ThenBy(r => r.AgeBucket)
                .ToList();
        }

        public IEnumerable<LossRatioRow> LossRatio(DateTime fromDate, DateTime toDate)
        {
            var policies = _unitOfWork.Policies.Query()
                .Where(p => p.BoundDate >= fromDate && p.BoundDate <= toDate)
                .Select(p => new { p.LineOfBusiness, p.GrossPremium })
                .ToList();

            var claims = _unitOfWork.Claims.Query()
                .Where(c => c.DateReported >= fromDate && c.DateReported <= toDate)
                .Select(c => new { c.Policy.LineOfBusiness, Incurred = c.ReserveAmount + c.PaidAmount })
                .ToList();

            var lobs = Enum.GetValues(typeof(LineOfBusiness)).Cast<LineOfBusiness>();

            return lobs.Select(lob =>
            {
                var earned = policies.Where(p => p.LineOfBusiness == lob).Sum(p => p.GrossPremium);
                var incurred = claims.Where(c => c.LineOfBusiness == lob).Sum(c => c.Incurred);

                return new LossRatioRow
                {
                    LineOfBusiness = lob,
                    EarnedPremium = earned,
                    IncurredLosses = incurred,
                    LossRatioPercent = earned > 0 ? Math.Round(incurred / earned * 100m, 1) : 0m
                };
            })
            .ToList();
        }

        public ExportableReport ExportPremiumVsTarget(DateTime fromDate, DateTime toDate)
        {
            var report = new ExportableReport
            {
                ReportName = "PremiumVsTarget",
                Columns = { "Period", "PremiumWritten", "Target", "VariancePercent" }
            };

            foreach (var row in PremiumVsTarget(fromDate, toDate))
            {
                report.Rows.Add(new List<string>
                {
                    row.PeriodLabel,
                    row.PremiumWritten.ToString("F2", CultureInfo.InvariantCulture),
                    row.Target.ToString("F2", CultureInfo.InvariantCulture),
                    row.VariancePercent.ToString("F1", CultureInfo.InvariantCulture)
                });
            }

            return report;
        }

        public ExportableReport ExportBrokerLeague(DateTime fromDate, DateTime toDate)
        {
            var report = new ExportableReport
            {
                ReportName = "BrokerLeague",
                Columns = { "Rank", "Broker", "Submissions", "Bound", "HitRatio", "GWP" }
            };

            foreach (var row in BrokerLeague(fromDate, toDate))
            {
                report.Rows.Add(new List<string>
                {
                    row.Rank.ToString(CultureInfo.InvariantCulture),
                    row.BrokerName,
                    row.SubmissionCount.ToString(CultureInfo.InvariantCulture),
                    row.BoundCount.ToString(CultureInfo.InvariantCulture),
                    row.HitRatio.ToString("F1", CultureInfo.InvariantCulture),
                    row.GrossWrittenPremium.ToString("F2", CultureInfo.InvariantCulture)
                });
            }

            return report;
        }

        private decimal GetMonthlyTarget()
        {
            var parameter = _unitOfWork.SystemParameters.FindOne(p => p.Key == PremiumTargetParameterKey);
            if (parameter != null && decimal.TryParse(parameter.Value, out var target))
            {
                return target;
            }
            return DefaultMonthlyTarget;
        }

        private static string GetAgeBucket(double ageDays)
        {
            if (ageDays <= 7) return "0-7 days";
            if (ageDays <= 14) return "8-14 days";
            if (ageDays <= 30) return "15-30 days";
            return "30+ days";
        }
    }
}
