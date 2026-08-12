using System;
using System.Collections.Generic;
using System.Linq;
using ApexInsurance.Domain.Entities;
using ApexInsurance.Domain.Enums;

namespace ApexInsurance.Data.Repositories
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly ApexInsuranceDbContext _context;

        public DashboardRepository(ApexInsuranceDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public int GetNewSubmissionsCount()
        {
            return _context.Submissions.Count(s => s.Status == SubmissionStatus.Received);
        }

        public int GetReferralsCount()
        {
            return _context.Quotes.Count(q => q.IsReferralRequired && q.ReferralDecision == ReferralDecision.Pending);
        }

        public int GetRenewalsDueCount(int daysAhead)
        {
            var now = DateTime.UtcNow;
            var horizon = now.AddDays(daysAhead);
            return _context.Policies.Count(p =>
                p.Status == PolicyStatus.Active && p.ExpiryDate >= now && p.ExpiryDate <= horizon);
        }

        public int GetOutstandingQuotesCount()
        {
            var now = DateTime.UtcNow;
            return _context.Quotes.Count(q =>
                !q.IsSelected && q.ExpiryDate >= now && q.ReferralDecision != ReferralDecision.Declined);
        }

        public int GetBoundAwaitingDocsCount()
        {
            return _context.Policies.Count(p =>
                p.Status == PolicyStatus.Active &&
                !_context.Documents.Any(d => d.PolicyId == p.Id && d.DocumentType == DocumentType.Policy));
        }

        public decimal GetPremiumWritten(DateTime fromDate, DateTime toDate)
        {
            return _context.Policies
                .Where(p => p.BoundDate >= fromDate && p.BoundDate <= toDate)
                .Sum(p => (decimal?)p.GrossPremium) ?? 0m;
        }

        public int GetBoundCount(DateTime fromDate, DateTime toDate)
        {
            return _context.Policies.Count(p => p.BoundDate >= fromDate && p.BoundDate <= toDate);
        }

        public int GetDeclinedQuoteCount(DateTime fromDate, DateTime toDate)
        {
            return _context.Quotes.Count(q =>
                q.ReferralDecision == ReferralDecision.Declined && q.CreatedDate >= fromDate && q.CreatedDate <= toDate);
        }

        public IEnumerable<double> GetTurnaroundDaysForBoundSubmissions(DateTime fromDate, DateTime toDate)
        {
            var rows = _context.Policies
                .Where(p => p.BoundDate >= fromDate && p.BoundDate <= toDate)
                .Select(p => new { p.BoundDate, p.Submission.CreatedDate })
                .ToList();

            return rows.Select(r => (r.BoundDate - r.CreatedDate).TotalDays);
        }

        public IEnumerable<BrokerPerformanceRow> GetBrokerPerformance(DateTime fromDate, DateTime toDate)
        {
            var submissionCounts = _context.Submissions
                .Where(s => s.CreatedDate >= fromDate && s.CreatedDate <= toDate)
                .GroupBy(s => s.BrokerId)
                .Select(g => new { BrokerId = g.Key, Count = g.Count() })
                .ToDictionary(x => x.BrokerId, x => x.Count);

            var quoteCounts = _context.Quotes
                .Where(q => q.CreatedDate >= fromDate && q.CreatedDate <= toDate)
                .GroupBy(q => q.Submission.BrokerId)
                .Select(g => new { BrokerId = g.Key, Count = g.Count() })
                .ToDictionary(x => x.BrokerId, x => x.Count);

            var boundStats = _context.Policies
                .Where(p => p.BoundDate >= fromDate && p.BoundDate <= toDate)
                .GroupBy(p => p.BrokerId)
                .Select(g => new { BrokerId = g.Key, Count = g.Count(), Gwp = g.Sum(p => p.GrossPremium) })
                .ToList();

            var brokers = _context.Brokers.Where(b => b.IsActive).ToList();

            return brokers.Select(b =>
            {
                var bound = boundStats.FirstOrDefault(x => x.BrokerId == b.Id);
                return new BrokerPerformanceRow
                {
                    BrokerId = b.Id,
                    BrokerName = b.Name,
                    SubmissionCount = submissionCounts.TryGetValue(b.Id, out var sc) ? sc : 0,
                    QuoteCount = quoteCounts.TryGetValue(b.Id, out var qc) ? qc : 0,
                    BoundCount = bound?.Count ?? 0,
                    GrossWrittenPremium = bound?.Gwp ?? 0m
                };
            })
            .OrderByDescending(r => r.GrossWrittenPremium)
            .ToList();
        }
    }
}
