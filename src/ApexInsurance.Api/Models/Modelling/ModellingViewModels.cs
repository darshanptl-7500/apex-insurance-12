namespace ApexInsurance.Api.Models.Modelling
{
    /// <summary>
    /// Maps <see cref="ApexInsurance.Services.Modelling.ExposureRow"/> for API responses.
    /// Territory has no foreign key on Insured/Policy in the current schema, so the
    /// "by-territory" breakdown from IModellingService approximates it using Insured.City.
    /// </summary>
    public class ExposureViewModel
    {
        public string Dimension { get; set; }
        public string Key { get; set; }
        public decimal SumInsured { get; set; }
        public decimal GrossPremium { get; set; }
        public int PolicyCount { get; set; }
    }
}
