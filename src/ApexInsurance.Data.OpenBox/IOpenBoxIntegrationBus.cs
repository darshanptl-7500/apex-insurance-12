using System;
using System.Collections.Generic;

namespace ApexInsurance.Data.OpenBox
{
    public class OpenBoxEventMessage
    {
        public string EventId { get; set; } = Guid.NewGuid().ToString("N");
        public string EventType { get; set; }
        public int SubmissionId { get; set; }
        public string UwReference { get; set; }
        public DateTime OccurredUtc { get; set; } = DateTime.UtcNow;
        public string Source { get; set; } = "ApexWorkbench";
        public string PayloadJson { get; set; }
    }

    /// <summary>Party master event published by Open Box / CRM onto routing key party.insured.</summary>
    public class InsuredPartyMessage
    {
        public string EventId { get; set; } = Guid.NewGuid().ToString("N");
        public string EventType { get; set; } = "InsuredCreated";
        public string ExternalId { get; set; }
        public string Name { get; set; }
        public string TradingName { get; set; }
        public string RegistrationNumber { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string PostCode { get; set; }
        public string TradeCode { get; set; }
        public string Occupancy { get; set; }
        public DateTime OccurredUtc { get; set; } = DateTime.UtcNow;
        public string Source { get; set; } = "OpenBox";
    }

    public class OpenBoxBusHealth
    {
        public string Mode { get; set; }
        public bool Connected { get; set; }
        public string Endpoint { get; set; }
        public string Message { get; set; }
        public double ElapsedSeconds { get; set; }
    }

    public interface IOpenBoxIntegrationBus
    {
        string Mode { get; }
        string Endpoint { get; }
        void Publish(OpenBoxEventMessage message);
        void PublishInsured(InsuredPartyMessage message);
        IList<OpenBoxEventMessage> Recent(int take = 50);
        OpenBoxBusHealth Probe();
    }
}
