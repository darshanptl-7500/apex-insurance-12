using System.Collections.Generic;
using ApexInsurance.Services.Dto;

namespace ApexInsurance.Services.Policies
{
    public interface IPolicyService
    {
        PolicyDto BindQuote(BindQuoteRequest request);
        PolicyDto Endorse(EndorsePolicyRequest request);
        PolicyDto Cancel(CancelPolicyRequest request);
        PolicyDto Reinstate(int policyId);
        PolicyDto GetById(int policyId);
        PolicyDto GetByPolicyNumber(string policyNumber);
        IEnumerable<RenewalDiaryItem> GetRenewalDiary(int daysAhead);
        int CreateRenewalSubmission(int policyId, int createdByUserId);
    }
}
