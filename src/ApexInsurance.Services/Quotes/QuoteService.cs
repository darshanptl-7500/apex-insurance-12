using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using ApexInsurance.Data;
using ApexInsurance.Domain.Entities;
using ApexInsurance.Domain.Enums;
using ApexInsurance.Services.Authority;
using ApexInsurance.Services.Dto;
using ApexInsurance.Services.Rating;

namespace ApexInsurance.Services.Quotes
{
    public class QuoteService : IQuoteService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IRatingService _ratingService;
        private readonly IAuthorityService _authorityService;
        private static readonly JsonSerializerOptions JsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        public QuoteService(IUnitOfWork unitOfWork, IRatingService ratingService, IAuthorityService authorityService)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _ratingService = ratingService ?? throw new ArgumentNullException(nameof(ratingService));
            _authorityService = authorityService ?? throw new ArgumentNullException(nameof(authorityService));
        }

        public QuoteDto CreateQuote(CreateQuoteRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));

            var submission = _unitOfWork.Submissions.GetWithDetails(request.SubmissionId);
            if (submission == null) throw new InvalidOperationException($"Submission {request.SubmissionId} not found.");

            var insured = _unitOfWork.Insureds.GetById(submission.InsuredId);
            var tradeCode = insured?.TradeId != null ? _unitOfWork.Trades.GetById(insured.TradeId.Value)?.Code : null;

            var breakdown = _ratingService.CalculatePremium(new PremiumCalculationRequest
            {
                LineOfBusiness = submission.LineOfBusiness,
                TradeCode = tradeCode,
                SumInsured = request.SumInsured,
                LimitOfIndemnity = request.LimitOfIndemnity,
                Deductible = request.Deductible,
                CommissionPercent = request.CommissionPercent
            });

            var referralReason = GetReferralReason(submission.LineOfBusiness, insured?.TradeId, request.SumInsured, request.LimitOfIndemnity);

            var underwriterRole = submission.Underwriter?.Role ?? UserRole.Underwriter;
            var authorityResult = _authorityService.CheckAuthority(new AuthorityCheckRequest
            {
                Role = underwriterRole,
                LineOfBusiness = submission.LineOfBusiness,
                SumInsured = request.SumInsured,
                LimitOfIndemnity = request.LimitOfIndemnity,
                Premium = breakdown.GrossPremium
            });

            var isReferralRequired = referralReason != null || !authorityResult.IsWithinAuthority;
            var combinedReason = referralReason ?? authorityResult.Reason;

            var nextVersion = (_unitOfWork.Quotes.GetLatestVersion(submission.Id)?.VersionNumber ?? 0) + 1;

            var quote = new Quote
            {
                SubmissionId = submission.Id,
                QuoteNumber = _unitOfWork.Quotes.GetNextQuoteNumber(),
                VersionNumber = nextVersion,
                SumInsured = request.SumInsured,
                LimitOfIndemnity = request.LimitOfIndemnity,
                Deductible = request.Deductible,
                GrossPremium = breakdown.GrossPremium,
                NetPremium = breakdown.NetPremium,
                CommissionPercent = breakdown.CommissionPercent,
                CommissionAmount = breakdown.CommissionAmount,
                IsReferralRequired = isReferralRequired,
                ReferralReason = combinedReason,
                ReferralDecision = isReferralRequired ? ReferralDecision.Pending : ReferralDecision.NotRequired,
                RatingBreakdownJson = JsonSerializer.Serialize(breakdown, JsonOptions),
                CreatedByUserId = request.CreatedByUserId,
                CreatedDate = DateTime.UtcNow,
                ExpiryDate = DateTime.UtcNow.AddDays(30)
            };

            _unitOfWork.Quotes.Add(quote);

            submission.Status = isReferralRequired ? SubmissionStatus.Referred : SubmissionStatus.Quoted;
            _unitOfWork.Submissions.Update(submission);

            _unitOfWork.SaveChanges();

            return MapToDto(quote, breakdown);
        }

        public QuoteDto SelectQuote(int quoteId)
        {
            var quote = _unitOfWork.Quotes.GetById(quoteId);
            if (quote == null) throw new InvalidOperationException($"Quote {quoteId} not found.");

            if (quote.IsReferralRequired && quote.ReferralDecision != ReferralDecision.Approved)
                throw new InvalidOperationException("Quote requires referral approval before it can be selected.");

            var siblings = _unitOfWork.Quotes.Find(q => q.SubmissionId == quote.SubmissionId);
            foreach (var sibling in siblings)
            {
                sibling.IsSelected = sibling.Id == quote.Id;
                _unitOfWork.Quotes.Update(sibling);
            }

            var submission = _unitOfWork.Submissions.GetById(quote.SubmissionId);
            if (submission != null)
            {
                submission.Status = SubmissionStatus.Quoted;
                _unitOfWork.Submissions.Update(submission);
            }

            _unitOfWork.SaveChanges();

            return MapToDto(quote, DeserializeBreakdown(quote.RatingBreakdownJson));
        }

        public IEnumerable<QuoteDto> GetQuotesForSubmission(int submissionId)
        {
            return _unitOfWork.Quotes.GetBySubmission(submissionId)
                .Select(q => MapToDto(q, DeserializeBreakdown(q.RatingBreakdownJson)))
                .ToList();
        }

        public QuoteDto GetQuoteById(int quoteId)
        {
            var quote = _unitOfWork.Quotes.GetById(quoteId);
            return quote == null ? null : MapToDto(quote, DeserializeBreakdown(quote.RatingBreakdownJson));
        }

        public IEnumerable<ReferralQueueItemDto> GetReferralQueue()
        {
            return _unitOfWork.Quotes.GetReferralQueue()
                .Select(q => new ReferralQueueItemDto
                {
                    QuoteId = q.Id,
                    QuoteNumber = q.QuoteNumber,
                    VersionNumber = q.VersionNumber,
                    SubmissionId = q.SubmissionId,
                    SubmissionNumber = q.Submission?.SubmissionNumber,
                    InsuredName = q.Submission?.Insured?.Name,
                    BrokerName = q.Submission?.Broker?.Name,
                    LineOfBusiness = q.Submission?.LineOfBusiness.ToString(),
                    UnderwriterName = q.Submission?.Underwriter?.FullName,
                    SumInsured = q.SumInsured,
                    LimitOfIndemnity = q.LimitOfIndemnity,
                    GrossPremium = q.GrossPremium,
                    ReferralReason = q.ReferralReason,
                    ReferralDecision = q.ReferralDecision.ToString(),
                    CreatedDate = q.CreatedDate
                })
                .ToList();
        }

        private string GetReferralReason(LineOfBusiness lob, int? tradeId, decimal sumInsured, decimal limit)
        {
            var rules = _unitOfWork.ReferralRules.Find(r =>
                r.IsActive && r.LineOfBusiness == lob && (r.TradeId == null || r.TradeId == tradeId));

            foreach (var rule in rules)
            {
                if (rule.MinSumInsured.HasValue && sumInsured < rule.MinSumInsured.Value) continue;
                if (rule.MaxSumInsured.HasValue && sumInsured > rule.MaxSumInsured.Value)
                    return rule.Reason;
                if (rule.MinLimit.HasValue && limit < rule.MinLimit.Value) continue;
                if (rule.MaxLimit.HasValue && limit > rule.MaxLimit.Value)
                    return rule.Reason;

                if (rule.TriggersOnRestrictedTrade && tradeId.HasValue)
                {
                    var trade = _unitOfWork.Trades.GetById(tradeId.Value);
                    if (trade != null && trade.IsRestricted) return rule.Reason;
                }
            }

            return null;
        }

        private PremiumBreakdown DeserializeBreakdown(string json)
        {
            if (string.IsNullOrWhiteSpace(json)) return null;
            try
            {
                return JsonSerializer.Deserialize<PremiumBreakdown>(json, JsonOptions);
            }
            catch
            {
                return null;
            }
        }

        private static QuoteDto MapToDto(Quote quote, PremiumBreakdown breakdown)
        {
            return new QuoteDto
            {
                Id = quote.Id,
                SubmissionId = quote.SubmissionId,
                QuoteNumber = quote.QuoteNumber,
                VersionNumber = quote.VersionNumber,
                IsSelected = quote.IsSelected,
                SumInsured = quote.SumInsured,
                LimitOfIndemnity = quote.LimitOfIndemnity,
                Deductible = quote.Deductible,
                GrossPremium = quote.GrossPremium,
                NetPremium = quote.NetPremium,
                CommissionAmount = quote.CommissionAmount,
                IsReferralRequired = quote.IsReferralRequired,
                ReferralReason = quote.ReferralReason,
                ReferralDecision = quote.ReferralDecision,
                CreatedDate = quote.CreatedDate,
                ExpiryDate = quote.ExpiryDate,
                Breakdown = breakdown
            };
        }
    }
}
