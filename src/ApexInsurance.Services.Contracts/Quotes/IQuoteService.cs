using System.Collections.Generic;
using ApexInsurance.Services.Dto;

namespace ApexInsurance.Services.Quotes
{
    public interface IQuoteService
    {
        QuoteDto CreateQuote(CreateQuoteRequest request);
        QuoteDto SelectQuote(int quoteId);
        IEnumerable<QuoteDto> GetQuotesForSubmission(int submissionId);
        QuoteDto GetQuoteById(int quoteId);
        IEnumerable<ReferralQueueItemDto> GetReferralQueue();
    }
}
