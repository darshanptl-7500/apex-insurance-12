using System;
using System.Linq;
using ApexInsurance.Data;
using ApexInsurance.Domain.Entities;
using ApexInsurance.Services.Dto;

namespace ApexInsurance.Services.Rating
{
    /// <summary>
    /// Simple, transparent commercial-lines rating engine. Real UW-style engines are far more
    /// sophisticated (peril-level modelling, exposure curves, etc.) - this implementation favours
    /// a clear, auditable breakdown suitable for underwriter review and demo purposes.
    /// </summary>
    public class RatingService : IRatingService
    {
        private const decimal DefaultBaseRatePer1000 = 4.5m;
        private const decimal DefaultMinPremium = 250m;

        private readonly IUnitOfWork _unitOfWork;

        public RatingService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        }

        public PremiumBreakdown CalculatePremium(PremiumCalculationRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));

            var trade = string.IsNullOrWhiteSpace(request.TradeCode)
                ? null
                : _unitOfWork.Trades.FindOne(t => t.Code == request.TradeCode);

            var rateTable = _unitOfWork.RateTables
                .Find(r => r.IsActive
                           && r.LineOfBusiness == request.LineOfBusiness
                           && (r.TradeId == null || (trade != null && r.TradeId == trade.Id)))
                .OrderByDescending(r => r.TradeId.HasValue) // prefer trade-specific rate over generic LOB rate
                .FirstOrDefault();

            var baseRate = rateTable?.BaseRatePer1000 ?? DefaultBaseRatePer1000;
            var minPremium = rateTable?.MinPremium ?? DefaultMinPremium;

            // Property is rated off sum insured; liability / PI off limit of indemnity.
            var rateBasis = request.LineOfBusiness == Domain.Enums.LineOfBusiness.Property
                ? request.SumInsured
                : request.LimitOfIndemnity;

            var basePremium = Math.Round(rateBasis / 1000m * baseRate, 2);

            var breakdown = new PremiumBreakdown
            {
                RateBasis = rateBasis,
                BaseRatePer1000 = baseRate,
                BasePremium = basePremium,
                TradeIsRestricted = trade?.IsRestricted ?? false,
                TradeLoadingPercent = trade?.IsRestricted == true ? trade.LoadingPercent : 0m
            };

            var runningPremium = basePremium;

            if (breakdown.TradeIsRestricted)
            {
                breakdown.TradeLoadingAmount = Math.Round(runningPremium * (breakdown.TradeLoadingPercent / 100m), 2);
                runningPremium += breakdown.TradeLoadingAmount;
            }

            breakdown.DeductibleCreditPercent = GetDeductibleCreditPercent(request.Deductible);
            breakdown.DeductibleCreditAmount = Math.Round(runningPremium * (breakdown.DeductibleCreditPercent / 100m), 2);
            runningPremium -= breakdown.DeductibleCreditAmount;

            breakdown.PremiumBeforeMinimum = Math.Round(runningPremium, 2);

            if (breakdown.PremiumBeforeMinimum < minPremium)
            {
                breakdown.MinimumPremiumApplied = true;
                breakdown.MinimumPremium = minPremium;
                runningPremium = minPremium;
            }

            breakdown.GrossPremium = Math.Round(runningPremium, 2);
            breakdown.CommissionPercent = request.CommissionPercent;
            breakdown.CommissionAmount = Math.Round(breakdown.GrossPremium * (request.CommissionPercent / 100m), 2);
            breakdown.NetPremium = breakdown.GrossPremium - breakdown.CommissionAmount;

            return breakdown;
        }

        /// <summary>Higher deductibles earn a larger premium credit, in simple bands.</summary>
        private static decimal GetDeductibleCreditPercent(decimal deductible)
        {
            if (deductible >= 25000m) return 15m;
            if (deductible >= 10000m) return 10m;
            if (deductible >= 5000m) return 5m;
            if (deductible >= 1000m) return 2m;
            return 0m;
        }
    }
}
