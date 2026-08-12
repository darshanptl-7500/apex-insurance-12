using System.Collections.Generic;
using System.Linq;
using ApexInsurance.Domain.Entities;

namespace ApexInsurance.Data.Repositories
{
    public class BrokerRepository : Repository<Broker>, IBrokerRepository
    {
        public BrokerRepository(ApexInsuranceDbContext context) : base(context)
        {
        }

        public Broker GetByCode(string brokerCode)
        {
            return DbSet.FirstOrDefault(b => b.BrokerCode == brokerCode);
        }

        public IEnumerable<Broker> GetActive()
        {
            return DbSet.Where(b => b.IsActive).OrderBy(b => b.Name).ToList();
        }

        public IEnumerable<Broker> Search(string term)
        {
            if (string.IsNullOrWhiteSpace(term)) return GetActive();
            term = term.ToLower();
            return DbSet
                .Where(b => b.Name.ToLower().Contains(term) || b.BrokerCode.ToLower().Contains(term))
                .OrderBy(b => b.Name)
                .ToList();
        }
    }
}
