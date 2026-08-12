using System;
using System.Collections.Generic;
using ApexInsurance.Domain.Entities;
using ApexInsurance.Domain.Enums;

namespace ApexInsurance.Data.Repositories
{
    public interface IPolicyRepository : IRepository<Policy>
    {
        IEnumerable<Policy> GetByStatus(PolicyStatus status);
        IEnumerable<Policy> GetByBroker(int brokerId);
        IEnumerable<Policy> GetByInsured(int insuredId);
        IEnumerable<Policy> GetExpiring(DateTime fromDate, DateTime toDate);
        Policy GetByPolicyNumber(string policyNumber);
        Policy GetWithDetails(int id);
        int CountPoliciesBoundInYear(int year);
    }
}
