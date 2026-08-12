using System;
using System.Collections.Generic;
using System.Linq;
using ApexInsurance.Data;
using ApexInsurance.Services.Dto;

namespace ApexInsurance.Services.Dashboard
{
    public class DashboardService : IDashboardService
    {
        private const string PremiumTargetParameterKey = "MonthlyPremiumTarget";
        private const decimal DefaultMonthlyTarget = 250000m;
        private const int DefaultRenewalWindowDays = 60;

        private readonly IUnitOfWork _unitOfWork;

        public DashboardService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        }

        public UnderwriterQueues GetQueues()
        {
            var repo = _unitOfWork.Dashboard;
            return new UnderwriterQueues
            {
                NewSubmissions = repo.GetNewSubmissionsCount(),
                Referrals = repo.GetReferralsCount(),
                RenewalsDue = repo.GetRenewalsDueCount(DefaultRenewalWindowDays),
                OutstandingQuotes = repo.GetOutstandingQuotesCount(),
                BoundAwaitingDocs = repo.GetBoundAwaitingDocsCount()
            };
        }

        public DashboardKpis GetKpis(DateTime fromDate, DateTime toDate)
        {
            var repo = _unitOfWork.Dashboard;

            var premiumWritten = repo.GetPremiumWritten(fromDate, toDate);
            var boundCount = repo.GetBoundCount(fromDate, toDate);
            var declinedCount = repo.GetDeclinedQuoteCount(fromDate, toDate);
            var turnaroundDays = repo.GetTurnaroundDaysForBoundSubmissions(fromDate, toDate).ToList();

            var target = GetMonthlyTarget() * MonthsBetween(fromDate, toDate);
            var totalDecisions = boundCount + declinedCount;

            return new DashboardKpis
            {
                PremiumWritten = premiumWritten,
                PremiumTarget = target,
                PercentOfTarget = target > 0 ? Math.Round(premiumWritten / target * 100m, 1) : 0m,
                HitRatio = totalDecisions > 0 ? Math.Round((decimal)boundCount / totalDecisions * 100m, 1) : 0m,
                AverageTurnaroundDays = turnaroundDays.Any() ? Math.Round(turnaroundDays.Average(), 1) : 0,
                BoundCount = boundCount,
                DeclinedCount = declinedCount
            };
        }

        public IEnumerable<BrokerPerformanceWidget> GetBrokerPerformance(DateTime fromDate, DateTime toDate, int topN = 10)
        {
            return _unitOfWork.Dashboard.GetBrokerPerformance(fromDate, toDate)
                .Take(topN)
                .Select(r => new BrokerPerformanceWidget
                {
                    BrokerId = r.BrokerId,
                    BrokerName = r.BrokerName,
                    SubmissionCount = r.SubmissionCount,
                    QuoteCount = r.QuoteCount,
                    BoundCount = r.BoundCount,
                    GrossWrittenPremium = r.GrossWrittenPremium,
                    HitRatio = r.SubmissionCount > 0 ? Math.Round((decimal)r.BoundCount / r.SubmissionCount * 100m, 1) : 0m
                })
                .ToList();
        }

        public DashboardSummary GetSummary(DateTime fromDate, DateTime toDate)
        {
            return new DashboardSummary
            {
                Queues = GetQueues(),
                Kpis = GetKpis(fromDate, toDate),
                TopBrokers = GetBrokerPerformance(fromDate, toDate).ToList()
            };
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

        private static int MonthsBetween(DateTime fromDate, DateTime toDate)
        {
            var months = ((toDate.Year - fromDate.Year) * 12) + toDate.Month - fromDate.Month + 1;
            return Math.Max(1, months);
        }
    }
}
