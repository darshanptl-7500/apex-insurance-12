namespace ApexInsurance.Domain.Enums
{
    public enum ClaimStatus
    {
        Open = 0,

        /// <summary>Reserve set and awaiting payment authorisation.</summary>
        ReservedForPayment = 1,

        Paid = 2,
        Closed = 3,
        Declined = 4,

        /// <summary>Previously closed claim that has been re-opened.</summary>
        Reopened = 5
    }
}
