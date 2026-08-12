using ApexInsurance.Domain.Enums;

namespace ApexInsurance.Domain.Entities
{
    /// <summary>
    /// Binding authority for a role on a line of business. A quote breaching any ceiling is
    /// referred upwards; a missing rule fails safe to referral.
    /// </summary>
    public class AuthorityRule : BaseEntity
    {
        public UserRole Role { get; set; }
        public LineOfBusiness LineOfBusiness { get; set; }
        public decimal MaxPremium { get; set; }
        public decimal MaxSumInsured { get; set; }
        public decimal MaxLimit { get; set; }
        public bool IsActive { get; set; }

        public AuthorityRule()
        {
            IsActive = true;
        }
    }
}
