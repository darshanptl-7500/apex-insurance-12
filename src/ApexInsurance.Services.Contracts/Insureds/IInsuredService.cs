using System;
using System.Collections.Generic;
using ApexInsurance.Domain.Entities;

namespace ApexInsurance.Services.Insureds
{
    public interface IInsuredService
    {
        PagedInsureds List(string search = null, int page = 1, int pageSize = 25);
        Insured GetById(int id);
        IList<Insured> Search(string term, int maxResults = 20);

        /// <summary>Idempotent upsert from an external party master (Open Box / CRM via RabbitMQ).</summary>
        InsuredUpsertResult UpsertFromExternal(ExternalInsuredRequest request);
    }

    public class PagedInsureds
    {
        public IList<Insured> Items { get; set; }
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }

    public class ExternalInsuredRequest
    {
        public string EventType { get; set; }
        public string ExternalId { get; set; }
        public string Name { get; set; }
        public string TradingName { get; set; }
        public string RegistrationNumber { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string PostCode { get; set; }
        public string TradeCode { get; set; }
        public string Occupancy { get; set; }
        public DateTime? OccurredUtc { get; set; }
    }

    public class InsuredUpsertResult
    {
        public bool Created { get; set; }
        public Insured Insured { get; set; }
    }
}
