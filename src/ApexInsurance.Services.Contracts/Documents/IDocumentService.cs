using System.Collections.Generic;
using ApexInsurance.Domain.Enums;
using ApexInsurance.Services.Dto;

namespace ApexInsurance.Services.Documents
{
    public interface IDocumentService
    {
        DocumentDto SaveDocument(SaveDocumentRequest request);
        DocumentDto AddNewVersion(int existingDocumentId, SaveDocumentRequest request);
        DocumentDto Classify(int documentId, DocumentType documentType);
        DocumentDto Annotate(int documentId, string notes);
        void LogAccess(int documentId, int userId, string accessType);
        DocumentDto GetById(int documentId);
        IEnumerable<DocumentDto> List(int? submissionId = null, int? policyId = null, int? claimId = null);
        IEnumerable<DocumentDto> GetForSubmission(int submissionId);
        IEnumerable<DocumentDto> GetForPolicy(int policyId);
        IEnumerable<DocumentDto> GetForClaim(int claimId);
        IEnumerable<DocumentDto> GetVersionHistory(int documentId);
        byte[] ReadContent(int documentId);
    }
}
