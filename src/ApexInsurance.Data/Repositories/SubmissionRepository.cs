using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using ApexInsurance.Domain.Entities;
using ApexInsurance.Domain.Enums;

namespace ApexInsurance.Data.Repositories
{
    public class SubmissionRepository : Repository<Submission>, ISubmissionRepository
    {
        public SubmissionRepository(ApexInsuranceDbContext context) : base(context)
        {
        }

        public IEnumerable<Submission> GetByStatus(SubmissionStatus status)
        {
            return DbSet.Where(s => s.Status == status)
                .OrderByDescending(s => s.CreatedDate)
                .ToList();
        }

        public IEnumerable<Submission> GetByBroker(int brokerId)
        {
            return DbSet.Where(s => s.BrokerId == brokerId)
                .OrderByDescending(s => s.CreatedDate)
                .ToList();
        }

        public IEnumerable<Submission> GetByUnderwriter(int userId)
        {
            return DbSet.Where(s => s.UnderwriterUserId == userId)
                .OrderByDescending(s => s.CreatedDate)
                .ToList();
        }

        public IEnumerable<Submission> GetUnassigned()
        {
            return DbSet.Where(s => s.UnderwriterUserId == null && s.Status == SubmissionStatus.Received)
                .OrderBy(s => s.ReceivedDate)
                .ToList();
        }

        public IEnumerable<Submission> GetReferralQueue()
        {
            return DbSet.Where(s => s.Status == SubmissionStatus.Referred)
                .OrderBy(s => s.ReceivedDate)
                .ToList();
        }

        public IEnumerable<Submission> GetNewSubmissions()
        {
            return DbSet.Where(s => s.Status == SubmissionStatus.Received)
                .OrderBy(s => s.ReceivedDate)
                .ToList();
        }

        public Submission GetWithDetails(int id)
        {
            return DbSet
                .Include(s => s.Broker)
                .Include(s => s.Insured)
                .Include(s => s.Underwriter)
                .Include(s => s.RiskAnswers)
                .Include(s => s.Quotes)
                .Include(s => s.Documents)
                .FirstOrDefault(s => s.Id == id);
        }

        public string GetNextSubmissionNumber()
        {
            var year = DateTime.UtcNow.Year;
            var prefix = $"SUB-{year}-";
            var count = DbSet.Count(s => s.SubmissionNumber.StartsWith(prefix));
            return $"{prefix}{(count + 1):D5}";
        }
    }
}
