using System.Collections.Generic;

namespace ApexInsurance.Domain.Entities
{
    public class Broker : BaseEntity
    {
        public string Name { get; set; }
        public string BrokerCode { get; set; }
        public string ContactEmail { get; set; }
        public string ContactPhone { get; set; }
        public string Address { get; set; }
        public string AgreementRef { get; set; }
        public bool IsActive { get; set; }

        /// <summary>Annual GWP target agreed with the broker, if one has been set.</summary>
        public decimal ProductionTarget { get; set; }

        public virtual ICollection<Contact> Contacts { get; set; } = new List<Contact>();
        public virtual ICollection<Submission> Submissions { get; set; } = new List<Submission>();
        public virtual ICollection<Policy> Policies { get; set; } = new List<Policy>();
        public virtual ICollection<Claim> Claims { get; set; } = new List<Claim>();

        public Broker()
        {
            IsActive = true;
        }
    }
}
