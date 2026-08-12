using System;

namespace ApexInsurance.Domain.Entities
{
    public class DocumentAccessLog : BaseEntity
    {
        public int DocumentId { get; set; }
        public int UserId { get; set; }
        public DateTime AccessDate { get; set; }

        /// <summary>What the user did with the file, e.g. View or Download.</summary>
        public string AccessType { get; set; }

        public virtual Document Document { get; set; }
        public virtual User User { get; set; }

        public DocumentAccessLog()
        {
            AccessDate = DateTime.UtcNow;
        }
    }
}
