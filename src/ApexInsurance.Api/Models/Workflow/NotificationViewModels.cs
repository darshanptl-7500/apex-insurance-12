using System;

namespace ApexInsurance.Api.Models.Workflow
{
    /// <summary>
    /// IWorkflowService only exposes SendNotification (write) - there is no query DTO, so
    /// WorkflowController reads ApexInsurance.Data.IUnitOfWork.Notifications directly for the
    /// GET endpoints. Field names mirror ApexInsurance.Domain.Entities.Notification.
    /// </summary>
    public class NotificationViewModel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public bool IsRead { get; set; }
        public DateTime CreatedDate { get; set; }
        public string LinkUrl { get; set; }
        public string RelatedEntityType { get; set; }
        public int? RelatedEntityId { get; set; }
    }
}
