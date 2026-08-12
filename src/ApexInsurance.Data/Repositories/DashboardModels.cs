using System;

namespace ApexInsurance.Data.Repositories
{
    /// <summary>Flat aggregation row returned by <see cref="IDashboardRepository.GetBrokerPerformance"/>.</summary>
    public class BrokerPerformanceRow
    {
        public int BrokerId { get; set; }
        public string BrokerName { get; set; }
        public int SubmissionCount { get; set; }
        public int QuoteCount { get; set; }
        public int BoundCount { get; set; }
        public decimal GrossWrittenPremium { get; set; }
    }
}
