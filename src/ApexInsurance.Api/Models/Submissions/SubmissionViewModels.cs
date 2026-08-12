using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ApexInsurance.Api.Models.Submissions
{
    /// <summary>
    /// There is no dedicated ApexInsurance.Services.Submissions.ISubmissionService in this
    /// build, so SubmissionsController talks to ApexInsurance.Data.IUnitOfWork.Submissions
    /// directly. These view models mirror ApexInsurance.Domain.Entities.Submission /
    /// RiskAnswer field names exactly so the mapping in the controller stays a straight copy.
    /// </summary>
    public class SubmissionListItemViewModel
    {
        public int Id { get; set; }
        public string SubmissionNumber { get; set; }
        public int BrokerId { get; set; }
        public string BrokerName { get; set; }
        public string BrokerContact { get; set; }
        public int InsuredId { get; set; }
        public string InsuredName { get; set; }
        public string LineOfBusiness { get; set; }
        public string Status { get; set; }
        public decimal? TargetPremium { get; set; }
        public DateTime RequestedEffectiveDate { get; set; }
        public DateTime ReceivedDate { get; set; }
        public int? UnderwriterUserId { get; set; }
        public string UnderwriterName { get; set; }
        public DateTime? DueDate { get; set; }
        public string Notes { get; set; }
    }

    public class SubmissionDetailViewModel : SubmissionListItemViewModel
    {
        public DateTime? AssignedDate { get; set; }
        public int? RenewedFromPolicyId { get; set; }
        public IList<RiskAnswerViewModel> RiskAnswers { get; set; } = new List<RiskAnswerViewModel>();
    }

    public class SubmissionCreateRequestViewModel
    {
        [Required]
        public int BrokerId { get; set; }

        [Required]
        public int InsuredId { get; set; }

        [Required]
        public string LineOfBusiness { get; set; }

        [Required]
        public DateTime RequestedEffectiveDate { get; set; }

        public decimal? TargetPremium { get; set; }
        public DateTime? DueDate { get; set; }
        public string Notes { get; set; }

        public string BrokerContact { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string PolicyType { get; set; }
        public string Mop { get; set; }
        public string PolicyDescription { get; set; }
        public string RiskAppetite { get; set; }
        public string BusinessArea { get; set; }
        public string NewOrRenewal { get; set; }
        public bool IsDelegatedAuthority { get; set; }
    }

    public class SubmissionStatusUpdateRequestViewModel
    {
        [Required]
        public string Status { get; set; }
    }

    public class SubmissionAssignRequestViewModel
    {
        [Required]
        public int UnderwriterId { get; set; }
    }

    public class SubmissionDueDateRequestViewModel
    {
        public DateTime? DueDate { get; set; }
    }

    public class RiskAnswerViewModel
    {
        public int Id { get; set; }

        [Required]
        public string QuestionCode { get; set; }

        public string QuestionText { get; set; }
        public string AnswerText { get; set; }
        public decimal? AnswerNumeric { get; set; }
    }

    public class RiskAnswersRequestViewModel
    {
        public IList<RiskAnswerViewModel> Answers { get; set; } = new List<RiskAnswerViewModel>();
    }
}
