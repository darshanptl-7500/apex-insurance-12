using System;

namespace ApexInsurance.Domain.Entities
{
    public class TaskComment : BaseEntity
    {
        public int TaskId { get; set; }
        public int AuthorUserId { get; set; }
        public string Body { get; set; }
        public DateTime CreatedUtc { get; set; }

        public virtual WorkflowTask Task { get; set; }

        public TaskComment()
        {
            CreatedUtc = DateTime.UtcNow;
        }
    }
}
