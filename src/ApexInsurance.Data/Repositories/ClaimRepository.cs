using System;
using System.Collections.Generic;
using System.Linq;
using ApexInsurance.Domain.Entities;
using ApexInsurance.Domain.Enums;

namespace ApexInsurance.Data.Repositories
{
    public class ClaimRepository : Repository<Claim>, IClaimRepository
    {
        public ClaimRepository(ApexInsuranceDbContext context) : base(context)
        {
        }

        public IEnumerable<Claim> GetByPolicy(int policyId)
        {
            return DbSet.Where(c => c.PolicyId == policyId).OrderByDescending(c => c.DateReported).ToList();
        }

        public IEnumerable<Claim> GetByInsured(int insuredId)
        {
            return DbSet.Where(c => c.InsuredId == insuredId).OrderByDescending(c => c.DateReported).ToList();
        }

        public IEnumerable<Claim> GetByBroker(int brokerId)
        {
            return DbSet.Where(c => c.BrokerId == brokerId).OrderByDescending(c => c.DateReported).ToList();
        }

        public IEnumerable<Claim> GetByStatus(ClaimStatus status)
        {
            return DbSet.Where(c => c.Status == status).OrderByDescending(c => c.DateReported).ToList();
        }

        public IEnumerable<Claim> GetOpenClaims()
        {
            return DbSet
                .Where(c => c.Status != ClaimStatus.Closed && c.Status != ClaimStatus.Declined)
                .OrderBy(c => c.DateReported)
                .ToList();
        }

        public IEnumerable<Claim> GetByHandler(int userId)
        {
            return DbSet.Where(c => c.HandlerUserId == userId).OrderByDescending(c => c.DateReported).ToList();
        }

        public string GetNextClaimNumber()
        {
            var year = DateTime.UtcNow.Year;
            var prefix = $"CLM-{year}-";
            var count = DbSet.Count(c => c.ClaimNumber.StartsWith(prefix));
            return $"{prefix}{(count + 1):D5}";
        }
    }
}
