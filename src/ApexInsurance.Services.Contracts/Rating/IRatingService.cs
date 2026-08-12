using ApexInsurance.Services.Dto;

namespace ApexInsurance.Services.Rating
{
    public interface IRatingService
    {
        PremiumBreakdown CalculatePremium(PremiumCalculationRequest request);
    }
}
