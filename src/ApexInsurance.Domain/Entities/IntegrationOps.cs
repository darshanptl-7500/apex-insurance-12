using System;

namespace ApexInsurance.Domain.Entities
{
    public class IntegrationActivity : BaseEntity
    {
        public DateTime OccurredUtc { get; set; }
        public string SystemName { get; set; }
        public string Direction { get; set; }
        public string ActionName { get; set; }
        public string Reference { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public int? ElapsedMs { get; set; }
    }

    public class ScheduledJob : BaseEntity
    {
        public string JobName { get; set; }
        public string ScheduleType { get; set; }
        public string RagStatus { get; set; }
        public DateTime? LastRunUtc { get; set; }
        public string JobStatus { get; set; }
        public bool IsActive { get; set; }
    }
}
