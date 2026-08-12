namespace ApexInsurance.Domain.Enums
{
    public enum PolicyStatus
    {
        Active = 0,
        Cancelled = 1,
        Expired = 2,

        /// <summary>A renewal submission has been raised but not yet bound.</summary>
        PendingRenewal = 3,

        /// <summary>Superseded by a bound renewal policy.</summary>
        Renewed = 4
    }
}
