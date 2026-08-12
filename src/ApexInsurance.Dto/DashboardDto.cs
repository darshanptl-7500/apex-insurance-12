using System.Collections.Generic;

namespace ApexInsurance.Services.Dto
{
    public class UnderwriterQueues
    {
        public int NewSubmissions { get; set; }
        public int Referrals { get; set; }
        public int RenewalsDue { get; set; }
        public int OutstandingQuotes { get; set; }
        public int BoundAwaitingDocs { get; set; }
    }

    public class DashboardKpis
    {
        public decimal PremiumWritten { get; set; }
        public decimal PremiumTarget { get; set; }
        public decimal PercentOfTarget { get; set; }
        public decimal HitRatio { get; set; }
        public double AverageTurnaroundDays { get; set; }
        public int BoundCount { get; set; }
        public int DeclinedCount { get; set; }
    }

    public class BrokerPerformanceWidget
    {
        public int BrokerId { get; set; }
        public string BrokerName { get; set; }
        public int SubmissionCount { get; set; }
        public int QuoteCount { get; set; }
        public int BoundCount { get; set; }
        public decimal GrossWrittenPremium { get; set; }
        public decimal HitRatio { get; set; }
    }

    public class DashboardSummary
    {
        public UnderwriterQueues Queues { get; set; }
        public DashboardKpis Kpis { get; set; }
        public List<BrokerPerformanceWidget> TopBrokers { get; set; }
    }
}
