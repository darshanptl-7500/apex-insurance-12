using System.Collections.Generic;
using ApexInsurance.Domain.Entities;

namespace ApexInsurance.Data.Repositories
{
    public interface IDocumentRepository : IRepository<Document>
    {
        IEnumerable<Document> Search(int? submissionId, int? policyId, int? claimId, bool latestOnly = true);
        IEnumerable<Document> GetBySubmission(int submissionId);
        IEnumerable<Document> GetByPolicy(int policyId);
        IEnumerable<Document> GetByClaim(int claimId);
        IEnumerable<Document> GetVersionHistory(int documentId);
        Document GetLatestVersion(int documentId);
    }
}
