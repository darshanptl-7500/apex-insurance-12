using System;
using System.Linq;
using ApexInsurance.Data;
using ApexInsurance.Services.Audit;
using ApexInsurance.Services.Dto;

namespace ApexInsurance.Services.Authority
{
    public class AuthorityService : IAuthorityService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAuditService _auditService;

        public AuthorityService(IUnitOfWork unitOfWork, IAuditService auditService)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _auditService = auditService ?? throw new ArgumentNullException(nameof(auditService));
        }

        public AuthorityCheckResult CheckAuthority(AuthorityCheckRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));

            var rule = _unitOfWork.AuthorityRules
                .FindOne(r => r.IsActive && r.Role == request.Role && r.LineOfBusiness == request.LineOfBusiness);

            if (rule == null)
            {
                // No authority configured for this role/LOB combination - fail safe to referral.
                return new AuthorityCheckResult
                {
                    RuleFound = false,
                    IsWithinAuthority = false,
                    Reason = $"No authority rule configured for {request.Role} on {request.LineOfBusiness}."
                };
            }

            var withinPremium = request.Premium <= rule.MaxPremium;
            var withinSumInsured = request.SumInsured <= rule.MaxSumInsured;
            var withinLimit = request.LimitOfIndemnity <= rule.MaxLimit;

            var isWithinAuthority = withinPremium && withinSumInsured && withinLimit;

            string reason = null;
            if (!isWithinAuthority)
            {
                if (!withinPremium) reason = $"Premium {request.Premium:C} exceeds authority limit {rule.MaxPremium:C}.";
                else if (!withinSumInsured) reason = $"Sum insured {request.SumInsured:C} exceeds authority limit {rule.MaxSumInsured:C}.";
                else reason = $"Limit of indemnity {request.LimitOfIndemnity:C} exceeds authority limit {rule.MaxLimit:C}.";
            }

            return new AuthorityCheckResult
            {
                RuleFound = true,
                IsWithinAuthority = isWithinAuthority,
                Reason = reason,
                MaxPremium = rule.MaxPremium,
                MaxSumInsured = rule.MaxSumInsured,
                MaxLimit = rule.MaxLimit
            };
        }

        public void RecordOverride(int userId, string entityName, int entityId, string reason)
        {
            _auditService.WriteAudit(entityName, entityId, "AuthorityOverride", userId, details: reason);
        }

        public void RecordReferralAudit(int quoteId, int userId, string action, string comments)
        {
            _auditService.WriteAudit("Quote", quoteId, $"Referral{action}", userId, details: comments);
        }
    }
}
