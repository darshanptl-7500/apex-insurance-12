namespace ApexInsurance.Domain.Enums
{
    public enum SubmissionStatus
    {
        /// <summary>Newly received broker submission, not yet assigned.</summary>
        Received = 0,

        /// <summary>Assigned to an underwriter and being worked.</summary>
        Triaged = 1,

        Quoted = 2,
        Referred = 3,
        Bound = 4,
        Declined = 5,

        /// <summary>Quoted but the broker placed the risk elsewhere.</summary>
        NotTakenUp = 6
    }
}
