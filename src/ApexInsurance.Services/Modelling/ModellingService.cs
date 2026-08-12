using System;
using System.Collections.Generic;
using System.Linq;
using ApexInsurance.Data;
using ApexInsurance.Domain.Enums;

namespace ApexInsurance.Services.Modelling
{
    public class ModellingService : IModellingService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ModellingService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        }

        public IList<ExposureRow> GetExposureByLob()
        {
            return ActivePolicies()
                .GroupBy(p => p.LineOfBusiness)
                .Select(g => new ExposureRow
                {
                    Key = ((int)g.Key).ToString(),
                    Label = g.Key.ToString(),
                    PolicyCount = g.Count(),
                    SumInsured = g.Sum(p => p.SumInsured),
                    GrossPremium = g.Sum(p => p.GrossPremium)
                })
                .OrderByDescending(r => r.SumInsured)
                .ToList();
        }

        public IList<ExposureRow> GetExposureByTerritory()
        {
            // Territory proxy: insured city (no catastrophe model in this legacy demo).
            return ActivePolicies()
                .GroupBy(p => string.IsNullOrEmpty(p.Insured.City) ? "Unknown" : p.Insured.City)
                .Select(g => new ExposureRow
                {
                    Key = g.Key,
                    Label = g.Key,
                    PolicyCount = g.Count(),
                    SumInsured = g.Sum(p => p.SumInsured),
                    GrossPremium = g.Sum(p => p.GrossPremium)
                })
                .OrderByDescending(r => r.SumInsured)
                .ToList();
        }

        public IList<ExposureRow> GetExposureByBroker()
        {
            return ActivePolicies()
                .GroupBy(p => new { p.BrokerId, Name = p.Broker != null ? p.Broker.Name : "Unknown" })
                .Select(g => new ExposureRow
                {
                    Key = g.Key.BrokerId.ToString(),
                    Label = g.Key.Name,
                    PolicyCount = g.Count(),
                    SumInsured = g.Sum(p => p.SumInsured),
                    GrossPremium = g.Sum(p => p.GrossPremium)
                })
                .OrderByDescending(r => r.SumInsured)
                .ToList();
        }

        public ConcentrationSummary GetConcentrationSummary()
        {
            var policies = ActivePolicies().ToList();
            var totalSi = policies.Sum(p => p.SumInsured);
            var largest = policies.OrderByDescending(p => p.SumInsured).FirstOrDefault();
            var byLob = policies.GroupBy(p => p.LineOfBusiness)
                .Select(g => new { Lob = g.Key, Si = g.Sum(p => p.SumInsured) })
                .OrderByDescending(x => x.Si)
                .FirstOrDefault();

            return new ConcentrationSummary
            {
                TotalSumInsured = totalSi,
                TotalGrossPremium = policies.Sum(p => p.GrossPremium),
                ActivePolicyCount = policies.Count,
                LargestSingleRiskSumInsured = largest?.SumInsured ?? 0,
                LargestRiskPolicyNumber = largest?.PolicyNumber,
                TopLob = byLob?.Lob.ToString() ?? "N/A",
                TopLobSharePercent = totalSi == 0 || byLob == null
                    ? 0
                    : Math.Round(byLob.Si / totalSi * 100m, 1)
            };
        }

        private IQueryable<Domain.Entities.Policy> ActivePolicies()
        {
            return _unitOfWork.Policies.Query()
                .Where(p => p.Status == PolicyStatus.Active);
        }
    }
}
