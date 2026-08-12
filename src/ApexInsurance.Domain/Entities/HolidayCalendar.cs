using System;

namespace ApexInsurance.Domain.Entities
{
    /// <summary>Non-working day, used when calculating working-day turnaround and task due dates.</summary>
    public class HolidayCalendar : BaseEntity
    {
        public DateTime HolidayDate { get; set; }
        public string Description { get; set; }
        public string CountryCode { get; set; }
    }
}
