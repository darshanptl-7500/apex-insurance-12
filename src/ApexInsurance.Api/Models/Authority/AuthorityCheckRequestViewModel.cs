using System.ComponentModel.DataAnnotations;

namespace ApexInsurance.Api.Models.Authority
{
    /// <summary>
    /// Binds to ApexInsurance.Services.Dto.AuthorityCheckRequest; Role is always taken from the
    /// authenticated caller's bearer token rather than the request body.
    /// </summary>
    public class AuthorityCheckRequestViewModel
    {
        [Required]
        public string LineOfBusiness { get; set; }

        public decimal SumInsured { get; set; }
        public decimal LimitOfIndemnity { get; set; }
        public decimal Premium { get; set; }
    }
}
