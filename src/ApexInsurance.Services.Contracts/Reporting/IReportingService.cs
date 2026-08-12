using System;
using System.Collections.Generic;
using ApexInsurance.Services.Dto;

namespace ApexInsurance.Services.Reporting
{
    public interface IReportingService
    {
        IEnumerable<PremiumVsTargetRow> PremiumVsTarget(DateTime fromDate, DateTime toDate);
        IEnumerable<BrokerLeagueRow> BrokerLeague(DateTime fromDate, DateTime toDate, int topN = 20);
        IEnumerable<PipelineAgingRow> PipelineAging();
        IEnumerable<LossRatioRow> LossRatio(DateTime fromDate, DateTime toDate);

        ExportableReport ExportPremiumVsTarget(DateTime fromDate, DateTime toDate);
        ExportableReport ExportBrokerLeague(DateTime fromDate, DateTime toDate);
    }
}
