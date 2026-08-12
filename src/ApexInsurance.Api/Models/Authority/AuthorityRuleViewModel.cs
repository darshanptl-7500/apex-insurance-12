namespace ApexInsurance.Api.Models.Authority
{
    /// <summary>
    /// IAuthorityService has no "list rules" method, so AuthorityController reads
    /// ApexInsurance.Data.IUnitOfWork.AuthorityRules directly for this endpoint.
    /// </summary>
    public class AuthorityRuleViewModel
    {
        public int Id { get; set; }
        public string Role { get; set; }
        public string LineOfBusiness { get; set; }
        public decimal MaxPremium { get; set; }
        public decimal MaxSumInsured { get; set; }
        public decimal MaxLimit { get; set; }
        public bool IsActive { get; set; }
    }
}
