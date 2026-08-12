using System;
using System.Collections.Generic;
using ApexInsurance.Domain.Enums;

namespace ApexInsurance.Services.Dto
{
    public class CreateTaskRequest
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public int? SubmissionId { get; set; }
        public int? ClaimId { get; set; }
        public int? DocumentId { get; set; }
        public int AssignedToUserId { get; set; }
        public int? CreatedByUserId { get; set; }
        public DateTime DueDate { get; set; }
        public string Priority { get; set; }
        public string TaskType { get; set; }
    }

    public class UpdateTaskRequest
    {
        public int? AssignedToUserId { get; set; }
        public string Priority { get; set; }
        public DateTime? DueDate { get; set; }
        public string Status { get; set; }
        public string Description { get; set; }
        public string QuestionnaireJson { get; set; }
        public int? ActionedByUserId { get; set; }
    }

    public class AddTaskCommentRequest
    {
        public int AuthorUserId { get; set; }
        public string Body { get; set; }
    }

    public class TaskCommentDto
    {
        public int Id { get; set; }
        public int AuthorUserId { get; set; }
        public string AuthorName { get; set; }
        public string Body { get; set; }
        public DateTime CreatedUtc { get; set; }
    }

    public class WorkflowTaskDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string TaskType { get; set; }
        public int? SubmissionId { get; set; }
        public string AccountName { get; set; }
        public string UwReference { get; set; }
        public int? ClaimId { get; set; }
        public int? DocumentId { get; set; }
        public string DocumentFileName { get; set; }
        public int AssignedToUserId { get; set; }
        public string AssignedToName { get; set; }
        public string PrincipalUw { get; set; }
        public int? CreatedByUserId { get; set; }
        public string CreatedByName { get; set; }
        public int? CompletedByUserId { get; set; }
        public string CompletedByName { get; set; }
        public TaskStatus Status { get; set; }
        public string Priority { get; set; }
        public DateTime DueDate { get; set; }
        public bool IsOverdue { get; set; }
        public DateTime? CompletedDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Reference { get; set; }
        public string LloydsPin { get; set; }
        public string QuestionnaireJson { get; set; }
        public IList<TaskCommentDto> Comments { get; set; } = new List<TaskCommentDto>();
    }

    public class ReferralActionRequest
    {
        public int QuoteId { get; set; }
        public int ActionedByUserId { get; set; }
        public string Comments { get; set; }
    }
}
