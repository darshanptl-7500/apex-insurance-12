using ApexInsurance.Services.Dto;

namespace ApexInsurance.Services.Workbench
{
    public interface IUnderwriterFileService
    {
        UnderwriterFileDto GetBySubmissionId(int submissionId);
    }
}
