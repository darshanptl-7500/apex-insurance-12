using System.Collections.Generic;
using ApexInsurance.Services.Dto;

namespace ApexInsurance.Services.Audit
{
    public interface IAuditService
    {
        void WriteAudit(string entityName, int entityId, string action, int? userId, string oldValue = null, string newValue = null, string details = null);
        void WriteLoginAudit(int? userId, string username, bool wasSuccessful, string ipAddress, string failureReason = null);
        void WriteDocumentAccess(int documentId, int userId, string accessType);

        IEnumerable<AuditLogDto> QueryAuditLogs(AuditLogQuery query);
        IEnumerable<LoginAuditDto> QueryLoginAudits(string username = null, System.DateTime? fromDate = null, System.DateTime? toDate = null);
    }
}
