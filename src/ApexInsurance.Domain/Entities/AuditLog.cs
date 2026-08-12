using System;

namespace ApexInsurance.Domain.Entities
{
    public class AuditLog : BaseEntity
    {
        public string EntityName { get; set; }
        public int EntityId { get; set; }
        public string Action { get; set; }

        /// <summary>Null for actions raised by the system rather than a signed-in user.</summary>
        public int? UserId { get; set; }

        public DateTime Timestamp { get; set; }
        public string OldValue { get; set; }
        public string NewValue { get; set; }
        public string Details { get; set; }

        public virtual User User { get; set; }

        public AuditLog()
        {
            Timestamp = DateTime.UtcNow;
        }
    }
}
