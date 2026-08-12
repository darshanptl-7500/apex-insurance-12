using System;
using System.Collections.Generic;
using System.Linq;
using ApexInsurance.Data;
using ApexInsurance.Domain.Entities;
using ApexInsurance.Domain.Enums;
using ApexInsurance.Services.Authority;
using ApexInsurance.Services.Dto;
using DomainTaskStatus = ApexInsurance.Domain.Enums.TaskStatus;

namespace ApexInsurance.Services.Workflow
{
    public class WorkflowService : IWorkflowService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAuthorityService _authorityService;

        public WorkflowService(IUnitOfWork unitOfWork, IAuthorityService authorityService)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _authorityService = authorityService ?? throw new ArgumentNullException(nameof(authorityService));
        }

        public void AssignSubmission(int submissionId, int underwriterUserId, int assignedByUserId)
        {
            var submission = _unitOfWork.Submissions.GetById(submissionId);
            if (submission == null) throw new InvalidOperationException($"Submission {submissionId} not found.");

            submission.UnderwriterUserId = underwriterUserId;
            submission.AssignedDate = DateTime.UtcNow;
            if (submission.Status == SubmissionStatus.Received)
            {
                submission.Status = SubmissionStatus.Triaged;
            }

            _unitOfWork.Submissions.Update(submission);
            _unitOfWork.SaveChanges();

            SendNotification(underwriterUserId, "New submission assigned",
                $"Submission {submission.SubmissionNumber} has been assigned to you.",
                relatedEntityType: "Submission", relatedEntityId: submission.Id);
        }

        public WorkflowTaskDto CreateTask(CreateTaskRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));

            var title = request.Title ?? string.Empty;
            string taskType;

            if (!string.IsNullOrWhiteSpace(request.TaskType))
            {
                taskType = request.TaskType.Trim();
                if (!title.StartsWith("[", StringComparison.Ordinal))
                {
                    title = $"[{taskType}] {title}";
                }
            }
            else if (title.StartsWith("[", StringComparison.Ordinal) && title.Contains("]"))
            {
                var end = title.IndexOf(']');
                taskType = title.Substring(1, end - 1).Trim();
                if (string.IsNullOrWhiteSpace(taskType))
                {
                    taskType = "Task";
                }
            }
            else
            {
                taskType = "Task";
            }

            var task = new WorkflowTask
            {
                Title = title,
                Description = request.Description,
                TaskType = taskType,
                SubmissionId = request.SubmissionId,
                ClaimId = request.ClaimId,
                DocumentId = request.DocumentId,
                AssignedToUserId = request.AssignedToUserId,
                CreatedByUserId = request.CreatedByUserId,
                DueDate = request.DueDate,
                Priority = string.IsNullOrWhiteSpace(request.Priority) ? "Normal" : request.Priority,
                Status = DomainTaskStatus.Pending,
                CreatedDate = DateTime.UtcNow
            };

            _unitOfWork.WorkflowTasks.Add(task);
            _unitOfWork.SaveChanges();

            task.Reference = "TASK-" + task.Id;
            task.LloydsPin = "PIN-" + task.Id.ToString("D5");
            _unitOfWork.WorkflowTasks.Update(task);
            _unitOfWork.SaveChanges();

            SendNotification(request.AssignedToUserId, "New task assigned", title,
                relatedEntityType: "WorkflowTask", relatedEntityId: task.Id);

            return MapToDto(task);
        }

        public WorkflowTaskDto GetTask(int taskId)
        {
            var task = _unitOfWork.WorkflowTasks.GetById(taskId);
            if (task == null) throw new InvalidOperationException($"Task {taskId} not found.");
            return MapToDto(task);
        }

        public WorkflowTaskDto UpdateTask(int taskId, UpdateTaskRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));

            var task = _unitOfWork.WorkflowTasks.GetById(taskId);
            if (task == null) throw new InvalidOperationException($"Task {taskId} not found.");

            if (request.AssignedToUserId.HasValue)
            {
                task.AssignedToUserId = request.AssignedToUserId.Value;
            }

            if (!string.IsNullOrWhiteSpace(request.Priority))
            {
                task.Priority = request.Priority;
            }

            if (request.DueDate.HasValue)
            {
                task.DueDate = request.DueDate.Value;
            }

            if (request.Description != null)
            {
                task.Description = request.Description;
            }

            if (request.QuestionnaireJson != null)
            {
                task.QuestionnaireJson = request.QuestionnaireJson;
            }

            if (!string.IsNullOrWhiteSpace(request.Status)
                && Enum.TryParse(request.Status, ignoreCase: true, out DomainTaskStatus parsed)
                && (parsed == DomainTaskStatus.Pending
                    || parsed == DomainTaskStatus.InProgress
                    || parsed == DomainTaskStatus.Completed
                    || parsed == DomainTaskStatus.Cancelled))
            {
                task.Status = parsed;
                if (parsed == DomainTaskStatus.Completed)
                {
                    task.CompletedDate = DateTime.UtcNow;
                    task.CompletedByUserId = request.ActionedByUserId;
                }
                else if (parsed == DomainTaskStatus.Cancelled)
                {
                    task.CompletedDate = DateTime.UtcNow;
                    task.CompletedByUserId = request.ActionedByUserId;
                }
            }

            _unitOfWork.WorkflowTasks.Update(task);
            _unitOfWork.SaveChanges();

            return MapToDto(task);
        }

        public WorkflowTaskDto CompleteTask(int taskId, int? completedByUserId = null)
        {
            var task = _unitOfWork.WorkflowTasks.GetById(taskId);
            if (task == null) throw new InvalidOperationException($"Task {taskId} not found.");

            task.Status = DomainTaskStatus.Completed;
            task.CompletedDate = DateTime.UtcNow;
            task.CompletedByUserId = completedByUserId;

            _unitOfWork.WorkflowTasks.Update(task);
            _unitOfWork.SaveChanges();

            return MapToDto(task);
        }

        public WorkflowTaskDto CancelTask(int taskId, int? actionedByUserId = null)
        {
            var task = _unitOfWork.WorkflowTasks.GetById(taskId);
            if (task == null) throw new InvalidOperationException($"Task {taskId} not found.");

            task.Status = DomainTaskStatus.Cancelled;
            task.CompletedDate = DateTime.UtcNow;
            task.CompletedByUserId = actionedByUserId;

            _unitOfWork.WorkflowTasks.Update(task);
            _unitOfWork.SaveChanges();

            return MapToDto(task);
        }

        public TaskCommentDto AddComment(int taskId, AddTaskCommentRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));

            var task = _unitOfWork.WorkflowTasks.GetById(taskId);
            if (task == null) throw new InvalidOperationException($"Task {taskId} not found.");

            var comment = new TaskComment
            {
                TaskId = taskId,
                AuthorUserId = request.AuthorUserId,
                Body = request.Body,
                CreatedUtc = DateTime.UtcNow
            };

            _unitOfWork.TaskComments.Add(comment);
            _unitOfWork.SaveChanges();

            var author = _unitOfWork.Users.GetById(comment.AuthorUserId);
            return new TaskCommentDto
            {
                Id = comment.Id,
                AuthorUserId = comment.AuthorUserId,
                AuthorName = author?.FullName,
                Body = comment.Body,
                CreatedUtc = comment.CreatedUtc
            };
        }

        public IEnumerable<WorkflowTaskDto> GetOverdueTasks()
        {
            var now = DateTime.UtcNow;
            var overdue = _unitOfWork.WorkflowTasks
                .Find(t => t.DueDate < now && t.Status != DomainTaskStatus.Completed && t.Status != DomainTaskStatus.Cancelled)
                .ToList();

            foreach (var task in overdue.Where(t => t.Status != DomainTaskStatus.Overdue))
            {
                task.Status = DomainTaskStatus.Overdue;
                _unitOfWork.WorkflowTasks.Update(task);
            }

            if (overdue.Any())
            {
                _unitOfWork.SaveChanges();
            }

            return overdue.Select(MapToDto).ToList();
        }

        public IEnumerable<WorkflowTaskDto> GetTasksForUser(int userId)
        {
            return _unitOfWork.WorkflowTasks
                .Find(t => t.AssignedToUserId == userId && t.Status != DomainTaskStatus.Completed)
                .OrderBy(t => t.DueDate)
                .Select(MapToDto)
                .ToList();
        }

        public IEnumerable<WorkflowTaskDto> GetTasksForSubmission(int submissionId)
        {
            var recentCutoff = DateTime.UtcNow.AddDays(-30);
            return _unitOfWork.WorkflowTasks
                .Find(t => t.SubmissionId == submissionId)
                .Where(t =>
                    (t.Status != DomainTaskStatus.Completed && t.Status != DomainTaskStatus.Cancelled)
                    || (t.CompletedDate.HasValue && t.CompletedDate.Value >= recentCutoff)
                    || t.CreatedDate >= recentCutoff)
                .OrderByDescending(t => t.CreatedDate)
                .Select(MapToDto)
                .ToList();
        }

        public QuoteDto ApproveReferral(ReferralActionRequest request)
        {
            var quote = GetReferralQuoteOrThrow(request.QuoteId);

            quote.ReferralDecision = ReferralDecision.Approved;
            quote.ReferralDecisionByUserId = request.ActionedByUserId;
            quote.ReferralDecisionDate = DateTime.UtcNow;
            quote.ReferralComments = request.Comments;

            _unitOfWork.Quotes.Update(quote);

            var submission = _unitOfWork.Submissions.GetById(quote.SubmissionId);
            if (submission != null)
            {
                submission.Status = SubmissionStatus.Quoted;
                _unitOfWork.Submissions.Update(submission);

                if (submission.UnderwriterUserId.HasValue)
                {
                    SendNotification(submission.UnderwriterUserId.Value, "Referral approved",
                        $"Quote {quote.QuoteNumber} was approved.", relatedEntityType: "Quote", relatedEntityId: quote.Id);
                }
            }

            _unitOfWork.SaveChanges();
            _authorityService.RecordReferralAudit(quote.Id, request.ActionedByUserId, "Approved", request.Comments);

            return new QuoteDto { Id = quote.Id, ReferralDecision = quote.ReferralDecision };
        }

        public QuoteDto DeclineReferral(ReferralActionRequest request)
        {
            var quote = GetReferralQuoteOrThrow(request.QuoteId);

            quote.ReferralDecision = ReferralDecision.Declined;
            quote.ReferralDecisionByUserId = request.ActionedByUserId;
            quote.ReferralDecisionDate = DateTime.UtcNow;
            quote.ReferralComments = request.Comments;

            _unitOfWork.Quotes.Update(quote);

            var submission = _unitOfWork.Submissions.GetById(quote.SubmissionId);
            if (submission != null)
            {
                submission.Status = SubmissionStatus.Declined;
                _unitOfWork.Submissions.Update(submission);

                if (submission.UnderwriterUserId.HasValue)
                {
                    SendNotification(submission.UnderwriterUserId.Value, "Referral declined",
                        $"Quote {quote.QuoteNumber} was declined: {request.Comments}", relatedEntityType: "Quote", relatedEntityId: quote.Id);
                }
            }

            _unitOfWork.SaveChanges();
            _authorityService.RecordReferralAudit(quote.Id, request.ActionedByUserId, "Declined", request.Comments);

            return new QuoteDto { Id = quote.Id, ReferralDecision = quote.ReferralDecision };
        }

        public QuoteDto RequestInfo(ReferralActionRequest request)
        {
            var quote = GetReferralQuoteOrThrow(request.QuoteId);

            quote.ReferralDecision = ReferralDecision.InfoRequested;
            quote.ReferralComments = request.Comments;

            _unitOfWork.Quotes.Update(quote);

            var submission = _unitOfWork.Submissions.GetById(quote.SubmissionId);
            if (submission?.UnderwriterUserId != null)
            {
                CreateTask(new CreateTaskRequest
                {
                    Title = $"Provide additional info for {quote.QuoteNumber}",
                    Description = request.Comments,
                    SubmissionId = submission.Id,
                    AssignedToUserId = submission.UnderwriterUserId.Value,
                    DueDate = DateTime.UtcNow.AddDays(2),
                    Priority = "High"
                });
            }

            _unitOfWork.SaveChanges();
            _authorityService.RecordReferralAudit(quote.Id, request.ActionedByUserId, "InfoRequested", request.Comments);

            return new QuoteDto { Id = quote.Id, ReferralDecision = quote.ReferralDecision };
        }

        public void SendNotification(int userId, string title, string message, string linkUrl = null, string relatedEntityType = null, int? relatedEntityId = null)
        {
            var notification = new Notification
            {
                UserId = userId,
                Title = title,
                Message = message,
                LinkUrl = linkUrl,
                RelatedEntityType = relatedEntityType,
                RelatedEntityId = relatedEntityId,
                CreatedDate = DateTime.UtcNow,
                IsRead = false
            };

            _unitOfWork.Notifications.Add(notification);
            _unitOfWork.SaveChanges();
        }

        private Quote GetReferralQuoteOrThrow(int quoteId)
        {
            var quote = _unitOfWork.Quotes.GetById(quoteId);
            if (quote == null) throw new InvalidOperationException($"Quote {quoteId} not found.");
            if (!quote.IsReferralRequired) throw new InvalidOperationException("Quote does not require referral.");
            return quote;
        }

        private WorkflowTaskDto MapToDto(WorkflowTask task)
        {
            var assignee = _unitOfWork.Users.GetById(task.AssignedToUserId);
            var createdBy = task.CreatedByUserId.HasValue
                ? _unitOfWork.Users.GetById(task.CreatedByUserId.Value)
                : null;
            var completedBy = task.CompletedByUserId.HasValue
                ? _unitOfWork.Users.GetById(task.CompletedByUserId.Value)
                : null;

            string accountName = null;
            string uwReference = null;
            string principalUw = null;

            if (task.SubmissionId.HasValue)
            {
                var submission = _unitOfWork.Submissions.GetWithDetails(task.SubmissionId.Value);
                accountName = submission?.Insured?.Name;
                uwReference = submission?.SubmissionNumber;

                var market = _unitOfWork.RiskMarketDetails.FindOne(m => m.SubmissionId == task.SubmissionId.Value);
                if (market != null)
                {
                    if (!string.IsNullOrWhiteSpace(market.UwReference))
                    {
                        uwReference = market.UwReference;
                    }
                    principalUw = market.PrincipalUw;
                }
            }

            string documentFileName = null;
            if (task.DocumentId.HasValue)
            {
                var document = _unitOfWork.Documents.GetById(task.DocumentId.Value);
                documentFileName = document?.FileName;
            }

            var comments = _unitOfWork.TaskComments
                .Find(c => c.TaskId == task.Id)
                .OrderBy(c => c.CreatedUtc)
                .Select(c =>
                {
                    var author = _unitOfWork.Users.GetById(c.AuthorUserId);
                    return new TaskCommentDto
                    {
                        Id = c.Id,
                        AuthorUserId = c.AuthorUserId,
                        AuthorName = author?.FullName,
                        Body = c.Body,
                        CreatedUtc = c.CreatedUtc
                    };
                })
                .ToList();

            return new WorkflowTaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                TaskType = task.TaskType,
                SubmissionId = task.SubmissionId,
                AccountName = accountName,
                UwReference = uwReference,
                ClaimId = task.ClaimId,
                DocumentId = task.DocumentId,
                DocumentFileName = documentFileName,
                AssignedToUserId = task.AssignedToUserId,
                AssignedToName = assignee?.FullName ?? task.AssignedTo?.FullName,
                PrincipalUw = principalUw,
                CreatedByUserId = task.CreatedByUserId,
                CreatedByName = createdBy?.FullName,
                CompletedByUserId = task.CompletedByUserId,
                CompletedByName = completedBy?.FullName,
                Status = task.Status,
                Priority = task.Priority,
                DueDate = task.DueDate,
                IsOverdue = task.Status != DomainTaskStatus.Completed
                    && task.Status != DomainTaskStatus.Cancelled
                    && task.DueDate < DateTime.UtcNow,
                CompletedDate = task.CompletedDate,
                CreatedDate = task.CreatedDate,
                Reference = task.Reference,
                LloydsPin = task.LloydsPin,
                QuestionnaireJson = task.QuestionnaireJson,
                Comments = comments
            };
        }
    }
}
