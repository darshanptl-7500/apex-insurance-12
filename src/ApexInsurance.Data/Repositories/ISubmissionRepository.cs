using System.Collections.Generic;
using ApexInsurance.Domain.Entities;
using ApexInsurance.Domain.Enums;

namespace ApexInsurance.Data.Repositories
{
    public interface ISubmissionRepository : IRepository<Submission>
    {
        IEnumerable<Submission> GetByStatus(SubmissionStatus status);
        IEnumerable<Submission> GetByBroker(int brokerId);
        IEnumerable<Submission> GetByUnderwriter(int userId);
        IEnumerable<Submission> GetUnassigned();
        IEnumerable<Submission> GetReferralQueue();
        IEnumerable<Submission> GetNewSubmissions();
        Submission GetWithDetails(int id);
        string GetNextSubmissionNumber();
    }
}
