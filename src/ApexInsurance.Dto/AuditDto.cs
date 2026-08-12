using System;

namespace ApexInsurance.Services.Dto
{
    public class AuditLogDto
    {
        public int Id { get; set; }
        public string EntityName { get; set; }
        public int EntityId { get; set; }
        public string Action { get; set; }
        public int? UserId { get; set; }
        public string Username { get; set; }
        public DateTime Timestamp { get; set; }
        public string OldValue { get; set; }
        public string NewValue { get; set; }
        public string Details { get; set; }
    }

    public class AuditLogQuery
    {
        public string EntityName { get; set; }
        public int? EntityId { get; set; }
        public int? UserId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

    public class LoginAuditDto
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string Username { get; set; }
        public DateTime LoginDate { get; set; }
        public string IpAddress { get; set; }
        public bool WasSuccessful { get; set; }
        public string FailureReason { get; set; }
    }
}
