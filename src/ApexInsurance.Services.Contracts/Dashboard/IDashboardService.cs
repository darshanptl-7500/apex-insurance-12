using System;
using System.Collections.Generic;
using ApexInsurance.Services.Dto;

namespace ApexInsurance.Services.Dashboard
{
    public interface IDashboardService
    {
        UnderwriterQueues GetQueues();
        DashboardKpis GetKpis(DateTime fromDate, DateTime toDate);
        IEnumerable<BrokerPerformanceWidget> GetBrokerPerformance(DateTime fromDate, DateTime toDate, int topN = 10);
        DashboardSummary GetSummary(DateTime fromDate, DateTime toDate);
    }
}
