namespace ApexInsurance.Domain.Enums
{
    public enum DocumentType
    {
        ProposalForm = 0,

        /// <summary>Schedule of values.</summary>
        SOV = 1,

        LossRuns = 2,
        Schedule = 3,
        Quote = 4,

        /// <summary>Issued policy wording / schedule.</summary>
        Policy = 5,

        Endorsement = 6,
        ClaimDoc = 7,
        Other = 8
    }
}
