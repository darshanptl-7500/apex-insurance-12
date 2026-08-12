using System.Collections.Generic;
using ApexInsurance.Domain.Enums;
using ApexInsurance.Services.Dto;

namespace ApexInsurance.Services.Claims
{
    public interface IClaimService
    {
        ClaimDto CreateFnol(CreateFnolRequest request);
        ClaimDto UpdateStatus(int claimId, ClaimStatus status, int userId);
        ClaimDto UpdateReserve(int claimId, decimal reserveAmount);
        ClaimDto RecordPayment(int claimId, decimal amount);
        ClaimDto AssignHandler(int claimId, int handlerUserId);
        ClaimDto CloseClaim(int claimId);
        ClaimDto GetById(int claimId);
        IEnumerable<ClaimDto> GetByPolicy(int policyId);
        IEnumerable<ClaimDto> GetByInsured(int insuredId);
        IEnumerable<ClaimDto> GetByBroker(int brokerId);
    }
}
