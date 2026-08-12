using System.Collections.Generic;
using ApexInsurance.Domain.Enums;

namespace ApexInsurance.Services.Modelling
{
    public interface IModellingService
    {
        IList<ExposureRow> GetExposureByLob();
        IList<ExposureRow> GetExposureByTerritory();
        IList<ExposureRow> GetExposureByBroker();
        ConcentrationSummary GetConcentrationSummary();
    }

    public class ExposureRow
    {
        public string Key { get; set; }
        public string Label { get; set; }
        public int PolicyCount { get; set; }
        public decimal SumInsured { get; set; }
        public decimal GrossPremium { get; set; }
    }

    public class ConcentrationSummary
    {
        public decimal TotalSumInsured { get; set; }
        public decimal TotalGrossPremium { get; set; }
        public int ActivePolicyCount { get; set; }
        public decimal LargestSingleRiskSumInsured { get; set; }
        public string LargestRiskPolicyNumber { get; set; }
        public string TopLob { get; set; }
        public decimal TopLobSharePercent { get; set; }
    }
}
