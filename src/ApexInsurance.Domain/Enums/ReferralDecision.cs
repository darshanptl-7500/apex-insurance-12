namespace ApexInsurance.Domain.Enums
{
    public enum ReferralDecision
    {
        /// <summary>Quote was within authority, so no referral was raised. Default for new quotes.</summary>
        NotRequired = 0,

        Pending = 1,
        Approved = 2,
        Declined = 3,

        /// <summary>Referring manager has asked the underwriter for more information.</summary>
        InfoRequested = 4
    }
}
