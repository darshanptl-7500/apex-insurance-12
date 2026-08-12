using System.Collections.Generic;

namespace ApexInsurance.Domain.Entities
{
    public class Insured : BaseEntity
    {
        public string Name { get; set; }
        public string TradingName { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string PostCode { get; set; }
        public string RegistrationNumber { get; set; }

        /// <summary>Stable id from Open Box / CRM for RabbitMQ party upserts.</summary>
        public string ExternalId { get; set; }

        public int? TradeId { get; set; }

        /// <summary>Free-text description of how the premises are used, where it differs from the trade.</summary>
        public string Occupancy { get; set; }

        public int? YearsTrading { get; set; }

        public virtual Trade Trade { get; set; }
        public virtual ICollection<Contact> Contacts { get; set; } = new List<Contact>();
        public virtual ICollection<Submission> Submissions { get; set; } = new List<Submission>();
        public virtual ICollection<Policy> Policies { get; set; } = new List<Policy>();
        public virtual ICollection<Claim> Claims { get; set; } = new List<Claim>();
    }
}
