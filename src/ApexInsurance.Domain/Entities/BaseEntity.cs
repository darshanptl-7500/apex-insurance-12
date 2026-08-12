namespace ApexInsurance.Domain.Entities
{
    /// <summary>
    /// Base for every persisted entity. Only the surrogate key lives here: the DbContext maps
    /// each entity's key explicitly via HasKey(x =&gt; x.Id).
    /// </summary>
    public abstract class BaseEntity
    {
        public int Id { get; set; }
    }
}
