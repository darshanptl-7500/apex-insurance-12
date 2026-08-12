using System;
using ApexInsurance.Domain.Enums;

namespace ApexInsurance.Domain.Entities
{
    /// <summary>
    /// A stored file attached to a submission, policy or claim. Versions form a flat chain: every
    /// superseding row points at the original via <see cref="ParentDocumentId"/>, and exactly one
    /// row in the chain has <see cref="IsLatestVersion"/> set.
    /// </summary>
    public class Document : BaseEntity
    {
        public string FileName { get; set; }
        public string StoredFileName { get; set; }
        public string StoragePath { get; set; }
        public string ContentType { get; set; }
        public DocumentType DocumentType { get; set; }
        public long FileSizeBytes { get; set; }

        public int VersionNumber { get; set; }
        public bool IsLatestVersion { get; set; }
        public int? ParentDocumentId { get; set; }

        public int? SubmissionId { get; set; }
        public int? PolicyId { get; set; }
        public int? ClaimId { get; set; }

        public int UploadedByUserId { get; set; }
        public DateTime UploadedDate { get; set; }
        public string Notes { get; set; }

        public virtual Submission Submission { get; set; }
        public virtual Policy Policy { get; set; }
        public virtual Claim Claim { get; set; }
        public virtual Document ParentDocument { get; set; }

        public Document()
        {
            VersionNumber = 1;
            IsLatestVersion = true;
            UploadedDate = DateTime.UtcNow;
        }
    }
}
