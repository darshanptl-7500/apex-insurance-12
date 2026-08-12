using System.Collections.Generic;

namespace ApexInsurance.Domain.Entities
{
    public class Team : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int? ManagerUserId { get; set; }
        public decimal PremiumTargetYtd { get; set; }
        public bool IsActive { get; set; }

        public virtual User Manager { get; set; }
        public virtual ICollection<User> Members { get; set; } = new List<User>();

        public Team()
        {
            IsActive = true;
        }
    }
}
