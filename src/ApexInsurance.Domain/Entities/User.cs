using System;
using System.Collections.Generic;
using ApexInsurance.Domain.Enums;

namespace ApexInsurance.Domain.Entities
{
    public class User : BaseEntity
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string PasswordHash { get; set; }
        public string PasswordSalt { get; set; }
        public UserRole Role { get; set; }
        public int? TeamId { get; set; }

        /// <summary>Per-user premium binding limit, used alongside the role-level AuthorityRule.</summary>
        public decimal AuthorityLimit { get; set; }

        public bool IsActive { get; set; }
        public DateTime? LastLoginDate { get; set; }
        public DateTime CreatedDate { get; set; }

        public virtual Team Team { get; set; }
        public virtual ICollection<Submission> AssignedSubmissions { get; set; } = new List<Submission>();
        public virtual ICollection<WorkflowTask> AssignedTasks { get; set; } = new List<WorkflowTask>();
        public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();
        public virtual ICollection<Claim> HandledClaims { get; set; } = new List<Claim>();

        public User()
        {
            IsActive = true;
            CreatedDate = DateTime.UtcNow;
        }
    }
}
