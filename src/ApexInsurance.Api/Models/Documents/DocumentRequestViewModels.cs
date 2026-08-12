using System.ComponentModel.DataAnnotations;

namespace ApexInsurance.Api.Models.Documents
{
    public class DocumentClassifyRequestViewModel
    {
        [Required]
        public string DocumentType { get; set; }
    }

    public class DocumentAnnotateRequestViewModel
    {
        public string Notes { get; set; }
    }
}
