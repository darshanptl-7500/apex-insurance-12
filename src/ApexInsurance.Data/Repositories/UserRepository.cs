using System.Collections.Generic;
using System.Linq;
using ApexInsurance.Domain.Entities;
using ApexInsurance.Domain.Enums;

namespace ApexInsurance.Data.Repositories
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(ApexInsuranceDbContext context) : base(context)
        {
        }

        public User GetByUsername(string username)
        {
            if (string.IsNullOrWhiteSpace(username)) return null;
            return DbSet.FirstOrDefault(u => u.Username.ToLower() == username.ToLower());
        }

        public IEnumerable<User> GetByRole(UserRole role)
        {
            return DbSet.Where(u => u.Role == role && u.IsActive).OrderBy(u => u.FullName).ToList();
        }

        public IEnumerable<User> GetActiveUnderwriters()
        {
            return DbSet
                .Where(u => u.IsActive && (u.Role == UserRole.Underwriter || u.Role == UserRole.UnderwritingManager))
                .OrderBy(u => u.FullName)
                .ToList();
        }

        public IEnumerable<User> GetActive()
        {
            return DbSet.Where(u => u.IsActive).OrderBy(u => u.FullName).ToList();
        }
    }
}
