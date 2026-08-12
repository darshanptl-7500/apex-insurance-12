using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using ApexInsurance.Domain.Entities;
using ApexInsurance.Domain.Enums;

namespace ApexInsurance.Data.Repositories
{
    public class QuoteRepository : Repository<Quote>, IQuoteRepository
    {
        public QuoteRepository(ApexInsuranceDbContext context) : base(context)
        {
        }

        public IEnumerable<Quote> GetBySubmission(int submissionId)
        {
            return DbSet.Where(q => q.SubmissionId == submissionId)
                .OrderByDescending(q => q.VersionNumber)
                .ToList();
        }

        public Quote GetSelectedForSubmission(int submissionId)
        {
            return DbSet.FirstOrDefault(q => q.SubmissionId == submissionId && q.IsSelected);
        }

        public Quote GetLatestVersion(int submissionId)
        {
            return DbSet.Where(q => q.SubmissionId == submissionId)
                .OrderByDescending(q => q.VersionNumber)
                .FirstOrDefault();
        }

        public IEnumerable<Quote> GetOutstanding()
        {
            return DbSet
                .Where(q => !q.IsSelected && q.ExpiryDate >= DateTime.UtcNow
                            && q.ReferralDecision != ReferralDecision.Declined)
                .OrderBy(q => q.ExpiryDate)
                .ToList();
        }

        public IEnumerable<Quote> GetReferralQueue()
        {
            return DbSet
                .Include(q => q.Submission)
                    .ThenInclude(s => s.Broker)
                .Include(q => q.Submission)
                    .ThenInclude(s => s.Insured)
                .Include(q => q.Submission)
                    .ThenInclude(s => s.Underwriter)
                .Where(q => q.IsReferralRequired && q.ReferralDecision == ReferralDecision.Pending)
                .OrderBy(q => q.CreatedDate)
                .ToList();
        }

        public string GetNextQuoteNumber()
        {
            var year = DateTime.UtcNow.Year;
            var prefix = $"QTE-{year}-";
            var count = DbSet.Count(q => q.QuoteNumber.StartsWith(prefix));
            return $"{prefix}{(count + 1):D5}";
        }
    }
}
