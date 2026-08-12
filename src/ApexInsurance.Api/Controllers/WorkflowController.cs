using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using ApexInsurance.Api.Filters;
using ApexInsurance.Api.Models.Common;
using ApexInsurance.Api.Models.Workflow;
using ApexInsurance.Data;
using ApexInsurance.Domain.Entities;
using ApexInsurance.Domain.Enums;
using ApexInsurance.Services.Dto;
using ApexInsurance.Services.Quotes;
using ApexInsurance.Services.Workflow;

namespace ApexInsurance.Api.Controllers
{
    [Route("api/workflow")]
    [AuthorizeRole]
    [ApiController]
    public class WorkflowController : ApexApiControllerBase
    {
        private readonly IWorkflowService _workflowService;
        private readonly IUnitOfWork _unitOfWork;

        public WorkflowController(IWorkflowService workflowService, IUnitOfWork unitOfWork)
        {
            _workflowService = workflowService;
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// GET api/workflow/tasks?userId=&amp;submissionId= —
        /// submission-scoped tasks if submissionId is set; otherwise a user's open tasks,
        /// or every overdue task across the team if userId is omitted.
        /// </summary>
        [HttpGet]
        [Route("tasks")]
        public IActionResult Tasks(int? userId = null, int? submissionId = null)
        {
            if (submissionId.HasValue)
            {
                return Ok(_workflowService.GetTasksForSubmission(submissionId.Value).ToList());
            }

            var tasks = userId.HasValue
                ? _workflowService.GetTasksForUser(userId.Value)
                : _workflowService.GetOverdueTasks();

            return Ok(tasks.ToList());
        }

        [HttpGet]
        [Route("tasks/{id:int}")]
        public IActionResult GetTask(int id)
        {
            var task = _workflowService.GetTask(id);
            return Ok(task);
        }

        [HttpPost]
        [Route("tasks")]
        public IActionResult CreateTask(CreateTaskRequest request)
        {
            if (request == null)
            {
                return BadRequest("Request body is required.");
            }

            if (!request.CreatedByUserId.HasValue)
            {
                request.CreatedByUserId = CurrentUserId;
            }

            var created = _workflowService.CreateTask(request);
            return Created($"api/workflow/tasks/{created.Id}", created);
        }

        [HttpPut]
        [Route("tasks/{id:int}")]
        public IActionResult UpdateTask(int id, UpdateTaskRequest request)
        {
            if (request == null)
            {
                return BadRequest("Request body is required.");
            }

            if (!request.ActionedByUserId.HasValue)
            {
                request.ActionedByUserId = CurrentUserId;
            }

            var updated = _workflowService.UpdateTask(id, request);
            return Ok(updated);
        }

        [HttpPut]
        [Route("tasks/{id:int}/complete")]
        public IActionResult CompleteTask(int id)
        {
            var updated = _workflowService.CompleteTask(id, CurrentUserId);
            return Ok(updated);
        }

        [HttpPut]
        [Route("tasks/{id:int}/cancel")]
        public IActionResult CancelTask(int id)
        {
            var updated = _workflowService.CancelTask(id, CurrentUserId);
            return Ok(updated);
        }

        [HttpPost]
        [Route("tasks/{id:int}/comments")]
        public IActionResult AddComment(int id, AddTaskCommentRequest request)
        {
            if (request == null)
            {
                return BadRequest("Request body is required.");
            }

            request.AuthorUserId = CurrentUserId;
            var comment = _workflowService.AddComment(id, request);
            return Ok(comment);
        }

        /// <summary>GET api/workflow/referrals - pending referral queue for underwriting managers.</summary>
        [HttpGet]
        [Route("referrals")]
        [AuthorizeRole(UserRole.UnderwritingManager, UserRole.Admin)]
        public IActionResult ReferralQueue([FromServices] IQuoteService quoteService)
        {
            return Ok(quoteService.GetReferralQueue().ToList());
        }

        /// <summary>PUT api/workflow/referrals/{quoteId}/approve - underwriting manager approves a referred quote.</summary>
        [HttpPut]
        [Route("referrals/{quoteId:int}/approve")]
        [AuthorizeRole(UserRole.UnderwritingManager, UserRole.Admin)]
        public IActionResult ApproveReferral(int quoteId, ReferralActionRequestViewModel request)
        {
            var updated = _workflowService.ApproveReferral(new ReferralActionRequest
            {
                QuoteId = quoteId,
                ActionedByUserId = CurrentUserId,
                Comments = request?.Comments
            });

            return Ok(updated);
        }

        [HttpPut]
        [Route("referrals/{quoteId:int}/decline")]
        [AuthorizeRole(UserRole.UnderwritingManager, UserRole.Admin)]
        public IActionResult DeclineReferral(int quoteId, ReferralActionRequestViewModel request)
        {
            var updated = _workflowService.DeclineReferral(new ReferralActionRequest
            {
                QuoteId = quoteId,
                ActionedByUserId = CurrentUserId,
                Comments = request?.Comments
            });

            return Ok(updated);
        }

        [HttpPut]
        [Route("referrals/{quoteId:int}/request-info")]
        [AuthorizeRole(UserRole.UnderwritingManager, UserRole.Admin)]
        public IActionResult RequestInfo(int quoteId, ReferralActionRequestViewModel request)
        {
            var updated = _workflowService.RequestInfo(new ReferralActionRequest
            {
                QuoteId = quoteId,
                ActionedByUserId = CurrentUserId,
                Comments = request?.Comments
            });

            return Ok(updated);
        }

        /// <summary>
        /// GET api/workflow/notifications?unreadOnly=&amp;page=&amp;pageSize= - always scoped to the
        /// caller. No query method exists on IWorkflowService, so this reads
        /// IUnitOfWork.Notifications directly.
        /// </summary>
        [HttpGet]
        [Route("notifications")]
        public IActionResult Notifications(bool? unreadOnly = null, int page = 1, int pageSize = 25)
        {
            var query = _unitOfWork.Notifications.Query().Where(n => n.UserId == CurrentUserId);
            if (unreadOnly == true)
            {
                query = query.Where(n => !n.IsRead);
            }

            var totalCount = query.Count();
            var items = query
                .OrderByDescending(n => n.CreatedDate)
                .Skip((Math.Max(page, 1) - 1) * pageSize)
                .Take(pageSize)
                .ToList()
                .Select(ToViewModel)
                .ToList();

            return Ok(new PagedResultViewModel<NotificationViewModel>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            });
        }

        [HttpPut]
        [Route("notifications/{id:int}/read")]
        public IActionResult MarkNotificationRead(int id)
        {
            var notification = _unitOfWork.Notifications.GetById(id);
            if (notification == null || notification.UserId != CurrentUserId)
            {
                return NotFound();
            }

            notification.IsRead = true;
            _unitOfWork.Notifications.Update(notification);
            _unitOfWork.SaveChanges();

            return Ok(ToViewModel(notification));
        }

        private static NotificationViewModel ToViewModel(Notification n)
        {
            return new NotificationViewModel
            {
                Id = n.Id,
                UserId = n.UserId,
                Title = n.Title,
                Message = n.Message,
                IsRead = n.IsRead,
                CreatedDate = n.CreatedDate,
                LinkUrl = n.LinkUrl,
                RelatedEntityType = n.RelatedEntityType,
                RelatedEntityId = n.RelatedEntityId
            };
        }
    }
}
