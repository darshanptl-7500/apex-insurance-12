using System.Collections.Generic;
using ApexInsurance.Domain.Entities;

namespace ApexInsurance.Data.Repositories
{
    public interface IBrokerRepository : IRepository<Broker>
    {
        Broker GetByCode(string brokerCode);
        IEnumerable<Broker> GetActive();
        IEnumerable<Broker> Search(string term);
    }
}
