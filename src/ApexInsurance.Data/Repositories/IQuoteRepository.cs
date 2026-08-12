using System.Collections.Generic;
using ApexInsurance.Domain.Entities;

namespace ApexInsurance.Data.Repositories
{
    public interface IQuoteRepository : IRepository<Quote>
    {
        IEnumerable<Quote> GetBySubmission(int submissionId);
        Quote GetSelectedForSubmission(int submissionId);
        Quote GetLatestVersion(int submissionId);
        IEnumerable<Quote> GetOutstanding();
        IEnumerable<Quote> GetReferralQueue();
        string GetNextQuoteNumber();
    }
}
