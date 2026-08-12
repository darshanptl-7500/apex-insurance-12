using System.Collections.Generic;
using System.Linq;
using ApexInsurance.Domain.Entities;

namespace ApexInsurance.Data.Repositories
{
    public class DocumentRepository : Repository<Document>, IDocumentRepository
    {
        public DocumentRepository(ApexInsuranceDbContext context) : base(context)
        {
        }

        public IEnumerable<Document> Search(int? submissionId, int? policyId, int? claimId, bool latestOnly = true)
        {
            var query = DbSet.AsQueryable();
            if (latestOnly)
            {
                query = query.Where(d => d.IsLatestVersion);
            }
            if (submissionId.HasValue)
            {
                query = query.Where(d => d.SubmissionId == submissionId.Value);
            }
            if (policyId.HasValue)
            {
                query = query.Where(d => d.PolicyId == policyId.Value);
            }
            if (claimId.HasValue)
            {
                query = query.Where(d => d.ClaimId == claimId.Value);
            }

            return query.OrderByDescending(d => d.UploadedDate).ToList();
        }

        public IEnumerable<Document> GetBySubmission(int submissionId)
        {
            return DbSet.Where(d => d.SubmissionId == submissionId && d.IsLatestVersion)
                .OrderByDescending(d => d.UploadedDate)
                .ToList();
        }

        public IEnumerable<Document> GetByPolicy(int policyId)
        {
            return DbSet.Where(d => d.PolicyId == policyId && d.IsLatestVersion)
                .OrderByDescending(d => d.UploadedDate)
                .ToList();
        }

        public IEnumerable<Document> GetByClaim(int claimId)
        {
            return DbSet.Where(d => d.ClaimId == claimId && d.IsLatestVersion)
                .OrderByDescending(d => d.UploadedDate)
                .ToList();
        }

        public IEnumerable<Document> GetVersionHistory(int documentId)
        {
            var doc = DbSet.FirstOrDefault(d => d.Id == documentId);
            if (doc == null) return Enumerable.Empty<Document>();

            var rootId = doc.ParentDocumentId ?? doc.Id;
            return DbSet.Where(d => d.Id == rootId || d.ParentDocumentId == rootId)
                .OrderBy(d => d.VersionNumber)
                .ToList();
        }

        public Document GetLatestVersion(int documentId)
        {
            var doc = DbSet.FirstOrDefault(d => d.Id == documentId);
            if (doc == null) return null;

            var rootId = doc.ParentDocumentId ?? doc.Id;
            return DbSet
                .Where(d => (d.Id == rootId || d.ParentDocumentId == rootId) && d.IsLatestVersion)
                .OrderByDescending(d => d.VersionNumber)
                .FirstOrDefault();
        }
    }
}
