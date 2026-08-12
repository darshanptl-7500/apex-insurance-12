using System;
using System.ComponentModel.DataAnnotations;

namespace ApexInsurance.Api.Models.Admin
{
    public class AddHolidayRequestViewModel
    {
        [Required]
        public DateTime HolidayDate { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public string CountryCode { get; set; }
    }
}
