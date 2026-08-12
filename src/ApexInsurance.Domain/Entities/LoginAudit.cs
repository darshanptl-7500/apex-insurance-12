using System;

namespace ApexInsurance.Domain.Entities
{
    public class LoginAudit : BaseEntity
    {
        /// <summary>Null when the attempt used a username that does not exist.</summary>
        public int? UserId { get; set; }

        public string Username { get; set; }
        public bool WasSuccessful { get; set; }
        public DateTime LoginDate { get; set; }
        public string IpAddress { get; set; }
        public string FailureReason { get; set; }

        public virtual User User { get; set; }

        public LoginAudit()
        {
            LoginDate = DateTime.UtcNow;
        }
    }
}
