namespace ApexInsurance.Domain.Entities
{
    /// <summary>Runtime-tunable setting, e.g. MonthlyPremiumTarget.</summary>
    public class SystemParameter : BaseEntity
    {
        public string Key { get; set; }
        public string Value { get; set; }
        public string Description { get; set; }

        /// <summary>How callers should interpret <see cref="Value"/>, e.g. Decimal, Int, Bool, String.</summary>
        public string DataType { get; set; }
    }
}
