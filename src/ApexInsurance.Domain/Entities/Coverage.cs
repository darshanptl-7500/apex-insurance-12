using ApexInsurance.Domain.Enums;

namespace ApexInsurance.Domain.Entities
{
    public class Coverage : BaseEntity
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public LineOfBusiness LineOfBusiness { get; set; }
        public decimal DefaultLimit { get; set; }

        /// <summary>Standard coverages are offered on every quote for the line of business.</summary>
        public bool IsStandard { get; set; }
    }
}
