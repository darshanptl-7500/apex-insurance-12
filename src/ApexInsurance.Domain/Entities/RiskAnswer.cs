namespace ApexInsurance.Domain.Entities
{
    /// <summary>
    /// One answer to one underwriting question on a submission. The answer is stored in whichever
    /// of the typed columns suits the question, keyed by <see cref="QuestionCode"/>.
    /// </summary>
    public class RiskAnswer : BaseEntity
    {
        public int SubmissionId { get; set; }
        public string QuestionCode { get; set; }
        public string QuestionText { get; set; }
        public string AnswerText { get; set; }
        public bool? AnswerBool { get; set; }
        public decimal? AnswerNumeric { get; set; }

        public virtual Submission Submission { get; set; }
    }
}
