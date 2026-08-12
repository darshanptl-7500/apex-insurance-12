using ApexInsurance.Domain.Enums;

namespace ApexInsurance.Services.Dto
{
    public class AuthorityCheckRequest
    {
        public UserRole Role { get; set; }
        public LineOfBusiness LineOfBusiness { get; set; }
        public decimal SumInsured { get; set; }
        public decimal LimitOfIndemnity { get; set; }
        public decimal Premium { get; set; }
    }

    public class AuthorityCheckResult
    {
        public bool IsWithinAuthority { get; set; }
        public bool RuleFound { get; set; }
        public string Reason { get; set; }
        public decimal? MaxPremium { get; set; }
        public decimal? MaxSumInsured { get; set; }
        public decimal? MaxLimit { get; set; }
    }
}
