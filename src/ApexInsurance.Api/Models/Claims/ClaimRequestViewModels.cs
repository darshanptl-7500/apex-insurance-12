using System.ComponentModel.DataAnnotations;

namespace ApexInsurance.Api.Models.Claims
{
    /// <summary>
    /// IClaimService exposes granular primitive-parameter methods (UpdateStatus, UpdateReserve,
    /// RecordPayment, AssignHandler) rather than a single PATCH-style Dto, so these small view
    /// models exist purely to bind each corresponding request body.
    /// </summary>
    public class ClaimStatusUpdateRequestViewModel
    {
        [Required]
        public string Status { get; set; }
    }

    public class ClaimReserveUpdateRequestViewModel
    {
        [Range(0, double.MaxValue)]
        public decimal ReserveAmount { get; set; }
    }

    public class ClaimPaymentRequestViewModel
    {
        [Range(0.01, double.MaxValue)]
        public decimal Amount { get; set; }
    }

    public class ClaimHandlerAssignRequestViewModel
    {
        [Required]
        public int HandlerUserId { get; set; }
    }
}
