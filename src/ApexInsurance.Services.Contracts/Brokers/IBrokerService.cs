using System.Collections.Generic;
using ApexInsurance.Domain.Entities;

namespace ApexInsurance.Services.Brokers
{
    public interface IBrokerService
    {
        PagedBrokers List(string search = null, bool? isActive = null, int page = 1, int pageSize = 25);
        Broker GetById(int id);
        BrokerPerformanceDto GetPerformance(int brokerId);
        Broker Create(CreateBrokerRequest request);
        Broker Update(UpdateBrokerRequest request);
        Broker Deactivate(int id);
    }

    public class CreateBrokerRequest
    {
        public string Name { get; set; }
        public string BrokerCode { get; set; }
        public string ContactEmail { get; set; }
        public string ContactPhone { get; set; }
        public string Address { get; set; }
        public string AgreementRef { get; set; }
        public decimal ProductionTarget { get; set; }
    }

    public class UpdateBrokerRequest
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ContactEmail { get; set; }
        public string ContactPhone { get; set; }
        public string Address { get; set; }
        public string AgreementRef { get; set; }
        public decimal ProductionTarget { get; set; }
        public bool IsActive { get; set; }
    }

    public class PagedBrokers
    {
        public IList<Broker> Items { get; set; }
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }

    public class BrokerPerformanceDto
    {
        public int BrokerId { get; set; }
        public string BrokerCode { get; set; }
        public string Name { get; set; }
        public int SubmissionCount { get; set; }
        public int BoundCount { get; set; }
        public decimal GrossWrittenPremium { get; set; }
        public decimal ProductionTarget { get; set; }
        public decimal HitRatio { get; set; }
        public decimal LossRatio { get; set; }
    }
}
