using System;
using System.Collections.Generic;

namespace ApexInsurance.Data.Repositories
{
    public interface IDashboardRepository
    {
        int GetNewSubmissionsCount();
        int GetReferralsCount();
        int GetRenewalsDueCount(int daysAhead);
        int GetOutstandingQuotesCount();
        int GetBoundAwaitingDocsCount();
        decimal GetPremiumWritten(DateTime fromDate, DateTime toDate);
        int GetBoundCount(DateTime fromDate, DateTime toDate);
        int GetDeclinedQuoteCount(DateTime fromDate, DateTime toDate);
        IEnumerable<double> GetTurnaroundDaysForBoundSubmissions(DateTime fromDate, DateTime toDate);
        IEnumerable<BrokerPerformanceRow> GetBrokerPerformance(DateTime fromDate, DateTime toDate);
    }
}
