using System;

namespace ApexInsurance.Domain.Entities
{
    public class Notification : BaseEntity
    {
        public int UserId { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public bool IsRead { get; set; }
        public DateTime CreatedDate { get; set; }
        public string LinkUrl { get; set; }

        /// <summary>Entity the notification points at, e.g. Submission or Quote, with its key.</summary>
        public string RelatedEntityType { get; set; }

        public int? RelatedEntityId { get; set; }

        public virtual User User { get; set; }

        public Notification()
        {
            CreatedDate = DateTime.UtcNow;
        }
    }
}
