using ApexInsurance.Services.Dto;

namespace ApexInsurance.Services.Support
{
    public interface ISupportHealthService
    {
        System.Collections.Generic.IList<HealthCheckItemDto> RunChecks();
    }
}
