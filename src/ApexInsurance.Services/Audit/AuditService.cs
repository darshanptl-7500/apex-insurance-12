using System;
using System.Collections.Generic;
using System.Linq;
using ApexInsurance.Data;
using ApexInsurance.Domain.Entities;
using ApexInsurance.Services.Dto;

namespace ApexInsurance.Services.Audit
{
    public class AuditService : IAuditService
    {
        private readonly IUnitOfWork _unitOfWork;

        public AuditService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        }

        public void WriteAudit(string entityName, int entityId, string action, int? userId, string oldValue = null, string newValue = null, string details = null)
        {
            var log = new AuditLog
            {
                EntityName = entityName,
                EntityId = entityId,
                Action = action,
                UserId = userId,
                OldValue = oldValue,
                NewValue = newValue,
                Details = details,
                Timestamp = DateTime.UtcNow
            };

            _unitOfWork.AuditLogs.Add(log);
            _unitOfWork.SaveChanges();
        }

        public void WriteLoginAudit(int? userId, string username, bool wasSuccessful, string ipAddress, string failureReason = null)
        {
            var log = new LoginAudit
            {
                UserId = userId,
                Username = username,
                WasSuccessful = wasSuccessful,
                IpAddress = ipAddress,
                FailureReason = failureReason,
                LoginDate = DateTime.UtcNow
            };

            _unitOfWork.LoginAudits.Add(log);
            _unitOfWork.SaveChanges();
        }

        public void WriteDocumentAccess(int documentId, int userId, string accessType)
        {
            var log = new DocumentAccessLog
            {
                DocumentId = documentId,
                UserId = userId,
                AccessType = accessType,
                AccessDate = DateTime.UtcNow
            };

            _unitOfWork.DocumentAccessLogs.Add(log);
            _unitOfWork.SaveChanges();
        }

        public IEnumerable<AuditLogDto> QueryAuditLogs(AuditLogQuery query)
        {
            var results = _unitOfWork.AuditLogs.Query();

            if (query != null)
            {
                if (!string.IsNullOrWhiteSpace(query.EntityName))
                    results = results.Where(a => a.EntityName == query.EntityName);
                if (query.EntityId.HasValue)
                    results = results.Where(a => a.EntityId == query.EntityId.Value);
                if (query.UserId.HasValue)
                    results = results.Where(a => a.UserId == query.UserId.Value);
                if (query.FromDate.HasValue)
                    results = results.Where(a => a.Timestamp >= query.FromDate.Value);
                if (query.ToDate.HasValue)
                    results = results.Where(a => a.Timestamp <= query.ToDate.Value);
            }

            var users = _unitOfWork.Users.GetAll().ToDictionary(u => u.Id, u => u.Username);

            return results
                .OrderByDescending(a => a.Timestamp)
                .ToList()
                .Select(a => new AuditLogDto
                {
                    Id = a.Id,
                    EntityName = a.EntityName,
                    EntityId = a.EntityId,
                    Action = a.Action,
                    UserId = a.UserId,
                    Username = a.UserId.HasValue && users.ContainsKey(a.UserId.Value) ? users[a.UserId.Value] : null,
                    Timestamp = a.Timestamp,
                    OldValue = a.OldValue,
                    NewValue = a.NewValue,
                    Details = a.Details
                })
                .ToList();
        }

        public IEnumerable<LoginAuditDto> QueryLoginAudits(string username = null, DateTime? fromDate = null, DateTime? toDate = null)
        {
            var results = _unitOfWork.LoginAudits.Query();

            if (!string.IsNullOrWhiteSpace(username))
                results = results.Where(l => l.Username == username);
            if (fromDate.HasValue)
                results = results.Where(l => l.LoginDate >= fromDate.Value);
            if (toDate.HasValue)
                results = results.Where(l => l.LoginDate <= toDate.Value);

            return results
                .OrderByDescending(l => l.LoginDate)
                .ToList()
                .Select(l => new LoginAuditDto
                {
                    Id = l.Id,
                    UserId = l.UserId,
                    Username = l.Username,
                    LoginDate = l.LoginDate,
                    IpAddress = l.IpAddress,
                    WasSuccessful = l.WasSuccessful,
                    FailureReason = l.FailureReason
                })
                .ToList();
        }
    }
}
