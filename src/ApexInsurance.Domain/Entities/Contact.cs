namespace ApexInsurance.Domain.Entities
{
    /// <summary>
    /// A named individual belonging to either a broker or an insured. Both foreign keys are
    /// optional so the same table can hold contacts for each side of the placement.
    /// </summary>
    public class Contact : BaseEntity
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string JobTitle { get; set; }
        public int? InsuredId { get; set; }
        public int? BrokerId { get; set; }

        public virtual Insured Insured { get; set; }
        public virtual Broker Broker { get; set; }
    }
}
