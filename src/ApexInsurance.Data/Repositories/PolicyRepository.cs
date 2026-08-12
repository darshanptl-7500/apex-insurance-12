using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using ApexInsurance.Domain.Entities;
using ApexInsurance.Domain.Enums;

namespace ApexInsurance.Data.Repositories
{
    public class PolicyRepository : Repository<Policy>, IPolicyRepository
    {
        public PolicyRepository(ApexInsuranceDbContext context) : base(context)
        {
        }

        public IEnumerable<Policy> GetByStatus(PolicyStatus status)
        {
            return DbSet.Where(p => p.Status == status).OrderByDescending(p => p.EffectiveDate).ToList();
        }

        public IEnumerable<Policy> GetByBroker(int brokerId)
        {
            return DbSet.Where(p => p.BrokerId == brokerId).OrderByDescending(p => p.EffectiveDate).ToList();
        }

        public IEnumerable<Policy> GetByInsured(int insuredId)
        {
            return DbSet.Where(p => p.InsuredId == insuredId).OrderByDescending(p => p.EffectiveDate).ToList();
        }

        public IEnumerable<Policy> GetExpiring(DateTime fromDate, DateTime toDate)
        {
            return DbSet
                .Where(p => p.Status == Domain.Enums.PolicyStatus.Active
                            && p.ExpiryDate >= fromDate
                            && p.ExpiryDate <= toDate)
                .OrderBy(p => p.ExpiryDate)
                .ToList();
        }

        public Policy GetByPolicyNumber(string policyNumber)
        {
            return DbSet.FirstOrDefault(p => p.PolicyNumber == policyNumber);
        }

        public Policy GetWithDetails(int id)
        {
            return DbSet
                .Include(p => p.Broker)
                .Include(p => p.Insured)
                .Include(p => p.Quote)
                .Include(p => p.Endorsements)
                .Include(p => p.Claims)
                .Include(p => p.Documents)
                .FirstOrDefault(p => p.Id == id);
        }

        public int CountPoliciesBoundInYear(int year)
        {
            return DbSet.Count(p => p.BoundDate.Year == year);
        }
    }
}
