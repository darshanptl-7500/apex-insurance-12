using System;
using ApexInsurance.Domain.Enums;

namespace ApexInsurance.Domain.Entities
{
    public class WorkflowTask : BaseEntity
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Priority { get; set; }
        public TaskStatus Status { get; set; }
        public string TaskType { get; set; }
        public int? DocumentId { get; set; }
        public int? CreatedByUserId { get; set; }
        public int? CompletedByUserId { get; set; }
        public string Reference { get; set; }
        public string LloydsPin { get; set; }
        public string QuestionnaireJson { get; set; }

        public int? SubmissionId { get; set; }
        public int? PolicyId { get; set; }
        public int? ClaimId { get; set; }

        public int AssignedToUserId { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? CompletedDate { get; set; }

        public virtual Submission Submission { get; set; }
        public virtual Claim Claim { get; set; }
        public virtual User AssignedTo { get; set; }

        public WorkflowTask()
        {
            Status = TaskStatus.Pending;
            Priority = "Normal";
            CreatedDate = DateTime.UtcNow;
            TaskType = "Task";
        }
    }
}
