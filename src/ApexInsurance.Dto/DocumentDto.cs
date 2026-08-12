using System;
using System.IO;
using ApexInsurance.Domain.Enums;

namespace ApexInsurance.Services.Dto
{
    public class SaveDocumentRequest
    {
        public string FileName { get; set; }
        public string ContentType { get; set; }
        public Stream Content { get; set; }
        public DocumentType DocumentType { get; set; }
        public int? SubmissionId { get; set; }
        public int? PolicyId { get; set; }
        public int? ClaimId { get; set; }
        public int UploadedByUserId { get; set; }
        public string Notes { get; set; }
    }

    public class DocumentDto
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string ContentType { get; set; }
        public long FileSizeBytes { get; set; }
        public DocumentType DocumentType { get; set; }
        public int? SubmissionId { get; set; }
        public int? PolicyId { get; set; }
        public int? ClaimId { get; set; }
        public int UploadedByUserId { get; set; }
        public DateTime UploadedDate { get; set; }
        public int VersionNumber { get; set; }
        public bool IsLatestVersion { get; set; }
        public string Notes { get; set; }
        public string StoragePath { get; set; }
    }
}
