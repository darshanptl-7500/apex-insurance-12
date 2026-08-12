using System.Collections.Generic;
using ApexInsurance.Domain.Entities;
using ApexInsurance.Domain.Enums;

namespace ApexInsurance.Data.Repositories
{
    public interface IUserRepository : IRepository<User>
    {
        User GetByUsername(string username);
        IEnumerable<User> GetByRole(UserRole role);
        IEnumerable<User> GetActiveUnderwriters();
        IEnumerable<User> GetActive();
    }
}
