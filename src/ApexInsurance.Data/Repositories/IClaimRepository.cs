using System;
using System.Collections.Generic;
using ApexInsurance.Domain.Entities;
using ApexInsurance.Domain.Enums;

namespace ApexInsurance.Data.Repositories
{
    public interface IClaimRepository : IRepository<Claim>
    {
        IEnumerable<Claim> GetByPolicy(int policyId);
        IEnumerable<Claim> GetByInsured(int insuredId);
        IEnumerable<Claim> GetByBroker(int brokerId);
        IEnumerable<Claim> GetByStatus(ClaimStatus status);
        IEnumerable<Claim> GetOpenClaims();
        IEnumerable<Claim> GetByHandler(int userId);
        string GetNextClaimNumber();
    }
}
