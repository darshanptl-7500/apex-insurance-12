using System.Collections.Generic;
using ApexInsurance.Services.Dto;

namespace ApexInsurance.Services.Workflow
{
    public interface IWorkflowService
    {
        void AssignSubmission(int submissionId, int underwriterUserId, int assignedByUserId);

        WorkflowTaskDto CreateTask(CreateTaskRequest request);
        WorkflowTaskDto GetTask(int taskId);
        WorkflowTaskDto UpdateTask(int taskId, UpdateTaskRequest request);
        WorkflowTaskDto CompleteTask(int taskId, int? completedByUserId = null);
        WorkflowTaskDto CancelTask(int taskId, int? actionedByUserId = null);
        TaskCommentDto AddComment(int taskId, AddTaskCommentRequest request);
        IEnumerable<WorkflowTaskDto> GetOverdueTasks();
        IEnumerable<WorkflowTaskDto> GetTasksForUser(int userId);
        IEnumerable<WorkflowTaskDto> GetTasksForSubmission(int submissionId);

        QuoteDto ApproveReferral(ReferralActionRequest request);
        QuoteDto DeclineReferral(ReferralActionRequest request);
        QuoteDto RequestInfo(ReferralActionRequest request);

        void SendNotification(int userId, string title, string message, string linkUrl = null, string relatedEntityType = null, int? relatedEntityId = null);
    }
}
