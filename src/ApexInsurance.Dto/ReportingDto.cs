using System;
using System.Collections.Generic;
using ApexInsurance.Domain.Enums;

namespace ApexInsurance.Services.Dto
{
    public class PremiumVsTargetRow
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public string PeriodLabel { get; set; }
        public decimal PremiumWritten { get; set; }
        public decimal Target { get; set; }
        public decimal VariancePercent { get; set; }
    }

    public class BrokerLeagueRow
    {
        public int Rank { get; set; }
        public int BrokerId { get; set; }
        public string BrokerName { get; set; }
        public int SubmissionCount { get; set; }
        public int BoundCount { get; set; }
        public decimal HitRatio { get; set; }
        public decimal GrossWrittenPremium { get; set; }
    }

    public class PipelineAgingRow
    {
        public SubmissionStatus Status { get; set; }
        public string AgeBucket { get; set; }
        public int Count { get; set; }
    }

    public class LossRatioRow
    {
        public LineOfBusiness LineOfBusiness { get; set; }
        public decimal EarnedPremium { get; set; }
        public decimal IncurredLosses { get; set; }
        public decimal LossRatioPercent { get; set; }
    }

    public class ReportRequest
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public LineOfBusiness? LineOfBusiness { get; set; }
    }

    /// <summary>Generic flat, export-friendly row set used for CSV/Excel style downloads.</summary>
    public class ExportableReport
    {
        public string ReportName { get; set; }
        public List<string> Columns { get; set; }
        public List<List<string>> Rows { get; set; }

        public ExportableReport()
        {
            Columns = new List<string>();
            Rows = new List<List<string>>();
        }

        public string ToCsv()
        {
            var sb = new System.Text.StringBuilder();
            sb.AppendLine(string.Join(",", Columns));
            foreach (var row in Rows)
            {
                sb.AppendLine(string.Join(",", row));
            }
            return sb.ToString();
        }
    }
}
