using ApexInsurance.Services.Dto;

namespace ApexInsurance.Services.Authority
{
    public interface IAuthorityService
    {
        AuthorityCheckResult CheckAuthority(AuthorityCheckRequest request);
        void RecordOverride(int userId, string entityName, int entityId, string reason);
        void RecordReferralAudit(int quoteId, int userId, string action, string comments);
    }
}
