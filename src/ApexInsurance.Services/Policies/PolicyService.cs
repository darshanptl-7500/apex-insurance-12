using System;
using System.Collections.Generic;
using System.Linq;
using ApexInsurance.Data;
using ApexInsurance.Domain.Entities;
using ApexInsurance.Domain.Enums;
using ApexInsurance.Services.Dto;

namespace ApexInsurance.Services.Policies
{
    public class PolicyService : IPolicyService
    {
        private readonly IUnitOfWork _unitOfWork;

        public PolicyService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        }

        public PolicyDto BindQuote(BindQuoteRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));

            var quote = _unitOfWork.Quotes.GetById(request.QuoteId);
            if (quote == null) throw new InvalidOperationException($"Quote {request.QuoteId} not found.");

            if (quote.IsReferralRequired && quote.ReferralDecision != ReferralDecision.Approved)
                throw new InvalidOperationException("Cannot bind a quote that is pending referral approval.");

            var submission = _unitOfWork.Submissions.GetById(quote.SubmissionId);
            if (submission == null) throw new InvalidOperationException($"Submission {quote.SubmissionId} not found.");

            var policy = new Policy
            {
                QuoteId = quote.Id,
                SubmissionId = submission.Id,
                BrokerId = submission.BrokerId,
                InsuredId = submission.InsuredId,
                LineOfBusiness = submission.LineOfBusiness,
                Status = PolicyStatus.Active,
                EffectiveDate = submission.RequestedEffectiveDate,
                ExpiryDate = submission.RequestedEffectiveDate.AddYears(1),
                GrossPremium = quote.GrossPremium,
                NetPremium = quote.NetPremium,
                SumInsured = quote.SumInsured,
                LimitOfIndemnity = quote.LimitOfIndemnity,
                Deductible = quote.Deductible,
                BoundDate = DateTime.UtcNow,
                BoundByUserId = request.BoundByUserId,
                RenewedFromPolicyId = submission.RenewedFromPolicyId,
                PolicyNumber = GeneratePolicyNumber()
            };

            _unitOfWork.Policies.Add(policy);

            quote.IsSelected = true;
            _unitOfWork.Quotes.Update(quote);

            submission.Status = SubmissionStatus.Bound;
            _unitOfWork.Submissions.Update(submission);

            if (submission.RenewedFromPolicyId.HasValue)
            {
                var priorPolicy = _unitOfWork.Policies.GetById(submission.RenewedFromPolicyId.Value);
                if (priorPolicy != null)
                {
                    priorPolicy.Status = PolicyStatus.Renewed;
                    _unitOfWork.Policies.Update(priorPolicy);
                }
            }

            _unitOfWork.SaveChanges();

            return MapToDto(policy);
        }

        public PolicyDto Endorse(EndorsePolicyRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));

            var policy = _unitOfWork.Policies.GetById(request.PolicyId);
            if (policy == null) throw new InvalidOperationException($"Policy {request.PolicyId} not found.");
            if (policy.Status != PolicyStatus.Active)
                throw new InvalidOperationException("Only active policies can be endorsed.");

            var endorsementCount = _unitOfWork.Endorsements.Count(e => e.PolicyId == policy.Id);

            var endorsement = new Endorsement
            {
                PolicyId = policy.Id,
                EndorsementNumber = $"{policy.PolicyNumber}-END-{(endorsementCount + 1):D3}",
                Description = request.Description,
                EffectiveDate = request.EffectiveDate,
                PremiumChange = request.PremiumChange,
                Status = "Active",
                CreatedByUserId = request.CreatedByUserId,
                CreatedDate = DateTime.UtcNow
            };

            _unitOfWork.Endorsements.Add(endorsement);

            policy.GrossPremium += request.PremiumChange;
            policy.NetPremium += request.PremiumChange;
            _unitOfWork.Policies.Update(policy);

            _unitOfWork.SaveChanges();

            return GetById(policy.Id);
        }

        public PolicyDto Cancel(CancelPolicyRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));

            var policy = _unitOfWork.Policies.GetById(request.PolicyId);
            if (policy == null) throw new InvalidOperationException($"Policy {request.PolicyId} not found.");
            if (policy.Status == PolicyStatus.Cancelled)
                throw new InvalidOperationException("Policy is already cancelled.");

            var totalDays = (policy.ExpiryDate - policy.EffectiveDate).TotalDays;
            var remainingDays = Math.Max(0, (policy.ExpiryDate - request.CancellationDate).TotalDays);
            var proRataRefund = totalDays > 0
                ? Math.Round(policy.GrossPremium * (decimal)(remainingDays / totalDays), 2)
                : 0m;

            var endorsementCount = _unitOfWork.Endorsements.Count(e => e.PolicyId == policy.Id);
            _unitOfWork.Endorsements.Add(new Endorsement
            {
                PolicyId = policy.Id,
                EndorsementNumber = $"{policy.PolicyNumber}-END-{(endorsementCount + 1):D3}",
                Description = $"Cancellation: {request.Reason}",
                EffectiveDate = request.CancellationDate,
                PremiumChange = -proRataRefund,
                Status = "Cancellation",
                CreatedByUserId = request.CancelledByUserId,
                CreatedDate = DateTime.UtcNow
            });

            policy.Status = PolicyStatus.Cancelled;
            policy.CancelledDate = request.CancellationDate;
            policy.CancellationReason = request.Reason;
            policy.GrossPremium -= proRataRefund;
            policy.NetPremium -= proRataRefund;

            _unitOfWork.Policies.Update(policy);
            _unitOfWork.SaveChanges();

            return GetById(policy.Id);
        }

        public PolicyDto Reinstate(int policyId)
        {
            var policy = _unitOfWork.Policies.GetById(policyId);
            if (policy == null) throw new InvalidOperationException($"Policy {policyId} not found.");
            if (policy.Status != PolicyStatus.Cancelled)
                throw new InvalidOperationException("Only cancelled policies can be reinstated.");

            const int reinstatementWindowDays = 30;
            if (policy.CancelledDate.HasValue &&
                (DateTime.UtcNow - policy.CancelledDate.Value).TotalDays > reinstatementWindowDays)
            {
                throw new InvalidOperationException($"Policy cancelled more than {reinstatementWindowDays} days ago and cannot be reinstated automatically.");
            }

            policy.Status = PolicyStatus.Active;
            policy.CancelledDate = null;
            policy.CancellationReason = null;

            _unitOfWork.Policies.Update(policy);
            _unitOfWork.SaveChanges();

            return GetById(policy.Id);
        }

        public PolicyDto GetById(int policyId)
        {
            var policy = _unitOfWork.Policies.GetWithDetails(policyId);
            return policy == null ? null : MapToDto(policy);
        }

        public PolicyDto GetByPolicyNumber(string policyNumber)
        {
            var policy = _unitOfWork.Policies.GetByPolicyNumber(policyNumber);
            return policy == null ? null : MapToDto(policy);
        }

        public IEnumerable<RenewalDiaryItem> GetRenewalDiary(int daysAhead)
        {
            var now = DateTime.UtcNow;
            var policies = _unitOfWork.Policies.GetExpiring(now, now.AddDays(daysAhead));

            return policies.Select(p => new RenewalDiaryItem
            {
                PolicyId = p.Id,
                PolicyNumber = p.PolicyNumber,
                InsuredName = p.Insured?.Name,
                BrokerName = p.Broker?.Name,
                ExpiryDate = p.ExpiryDate,
                DaysToExpiry = (int)Math.Ceiling((p.ExpiryDate - now).TotalDays),
                ExpiringPremium = p.GrossPremium,
                RenewalSubmissionCreated = _unitOfWork.Submissions.Any(s => s.RenewedFromPolicyId == p.Id)
            })
            .OrderBy(r => r.ExpiryDate)
            .ToList();
        }

        public int CreateRenewalSubmission(int policyId, int createdByUserId)
        {
            var policy = _unitOfWork.Policies.GetById(policyId);
            if (policy == null) throw new InvalidOperationException($"Policy {policyId} not found.");

            var existing = _unitOfWork.Submissions.FindOne(s => s.RenewedFromPolicyId == policyId);
            if (existing != null) return existing.Id;

            var renewalSubmission = new Submission
            {
                SubmissionNumber = _unitOfWork.Submissions.GetNextSubmissionNumber(),
                BrokerId = policy.BrokerId,
                InsuredId = policy.InsuredId,
                LineOfBusiness = policy.LineOfBusiness,
                Status = SubmissionStatus.Received,
                TargetPremium = policy.GrossPremium,
                RequestedEffectiveDate = policy.ExpiryDate,
                ReceivedDate = DateTime.UtcNow,
                CreatedDate = DateTime.UtcNow,
                RenewedFromPolicyId = policy.Id,
                Notes = $"Renewal of policy {policy.PolicyNumber}."
            };

            _unitOfWork.Submissions.Add(renewalSubmission);

            policy.Status = PolicyStatus.PendingRenewal;
            _unitOfWork.Policies.Update(policy);

            _unitOfWork.SaveChanges();

            return renewalSubmission.Id;
        }

        private string GeneratePolicyNumber()
        {
            var year = DateTime.UtcNow.Year;
            var count = _unitOfWork.Policies.CountPoliciesBoundInYear(year);
            return $"APEX-{year}-{(count + 1):D5}";
        }

        private static PolicyDto MapToDto(Policy policy)
        {
            return new PolicyDto
            {
                Id = policy.Id,
                PolicyNumber = policy.PolicyNumber,
                SubmissionId = policy.SubmissionId,
                BrokerId = policy.BrokerId,
                BrokerName = policy.Broker?.Name,
                InsuredId = policy.InsuredId,
                InsuredName = policy.Insured?.Name,
                LineOfBusiness = policy.LineOfBusiness,
                Status = policy.Status,
                EffectiveDate = policy.EffectiveDate,
                ExpiryDate = policy.ExpiryDate,
                GrossPremium = policy.GrossPremium,
                NetPremium = policy.NetPremium,
                SumInsured = policy.SumInsured,
                LimitOfIndemnity = policy.LimitOfIndemnity,
                Deductible = policy.Deductible,
                BoundDate = policy.BoundDate,
                CancelledDate = policy.CancelledDate,
                CancellationReason = policy.CancellationReason,
                Endorsements = policy.Endorsements?
                    .OrderByDescending(e => e.EffectiveDate)
                    .Select(e => new PolicyEndorsementDto
                    {
                        Id = e.Id,
                        EndorsementNumber = e.EndorsementNumber,
                        EffectiveDate = e.EffectiveDate,
                        Description = e.Description,
                        PremiumChange = e.PremiumChange,
                        Status = e.Status
                    }).ToList()
                    ?? new List<PolicyEndorsementDto>(),
                Claims = policy.Claims?
                    .OrderByDescending(c => c.DateOfLoss)
                    .Select(c => new ClaimDto
                    {
                        Id = c.Id,
                        ClaimNumber = c.ClaimNumber,
                        PolicyId = c.PolicyId,
                        PolicyNumber = policy.PolicyNumber,
                        InsuredId = c.InsuredId,
                        BrokerId = c.BrokerId,
                        DateOfLoss = c.DateOfLoss,
                        DateReported = c.DateReported,
                        Description = c.Description,
                        Status = c.Status,
                        ReserveAmount = c.ReserveAmount,
                        PaidAmount = c.PaidAmount,
                        HandlerUserId = c.HandlerUserId,
                        ClosedDate = c.ClosedDate
                    }).ToList()
                    ?? new List<ClaimDto>(),
                Documents = policy.Documents?
                    .Where(d => d.IsLatestVersion)
                    .OrderByDescending(d => d.UploadedDate)
                    .Select(d => new PolicyDocumentDto
                    {
                        Id = d.Id,
                        FileName = d.FileName,
                        UploadedDate = d.UploadedDate,
                        ContentType = d.ContentType
                    }).ToList()
                    ?? new List<PolicyDocumentDto>()
            };
        }
    }
}
