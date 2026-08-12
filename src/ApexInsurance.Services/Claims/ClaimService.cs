using System;
using System.Collections.Generic;
using System.Linq;
using ApexInsurance.Data;
using ApexInsurance.Domain.Entities;
using ApexInsurance.Domain.Enums;
using ApexInsurance.Services.Dto;

namespace ApexInsurance.Services.Claims
{
    public class ClaimService : IClaimService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ClaimService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        }

        public ClaimDto CreateFnol(CreateFnolRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));

            var policy = _unitOfWork.Policies.GetById(request.PolicyId);
            if (policy == null) throw new InvalidOperationException($"Policy {request.PolicyId} not found.");

            var claim = new Claim
            {
                ClaimNumber = _unitOfWork.Claims.GetNextClaimNumber(),
                PolicyId = policy.Id,
                InsuredId = policy.InsuredId,
                BrokerId = policy.BrokerId,
                DateOfLoss = request.DateOfLoss,
                DateReported = DateTime.UtcNow,
                Description = request.Description,
                Status = ClaimStatus.Open,
                ReserveAmount = request.InitialReserve,
                PaidAmount = 0m,
                CreatedDate = DateTime.UtcNow
            };

            _unitOfWork.Claims.Add(claim);
            _unitOfWork.SaveChanges();

            return MapToDto(claim);
        }

        public ClaimDto UpdateStatus(int claimId, ClaimStatus status, int userId)
        {
            var claim = GetClaimOrThrow(claimId);
            claim.Status = status;

            if (status == ClaimStatus.Closed)
            {
                claim.ClosedDate = DateTime.UtcNow;
            }
            else if (claim.ClosedDate.HasValue && status == ClaimStatus.Reopened)
            {
                claim.ClosedDate = null;
            }

            _unitOfWork.Claims.Update(claim);
            _unitOfWork.SaveChanges();

            return MapToDto(claim);
        }

        public ClaimDto UpdateReserve(int claimId, decimal reserveAmount)
        {
            var claim = GetClaimOrThrow(claimId);
            claim.ReserveAmount = reserveAmount;
            if (claim.Status == ClaimStatus.Open)
            {
                claim.Status = ClaimStatus.ReservedForPayment;
            }

            _unitOfWork.Claims.Update(claim);
            _unitOfWork.SaveChanges();

            return MapToDto(claim);
        }

        public ClaimDto RecordPayment(int claimId, decimal amount)
        {
            var claim = GetClaimOrThrow(claimId);
            claim.PaidAmount += amount;
            claim.ReserveAmount = Math.Max(0, claim.ReserveAmount - amount);
            claim.Status = ClaimStatus.Paid;

            _unitOfWork.Claims.Update(claim);
            _unitOfWork.SaveChanges();

            return MapToDto(claim);
        }

        public ClaimDto AssignHandler(int claimId, int handlerUserId)
        {
            var claim = GetClaimOrThrow(claimId);
            claim.HandlerUserId = handlerUserId;

            _unitOfWork.Claims.Update(claim);
            _unitOfWork.SaveChanges();

            return MapToDto(claim);
        }

        public ClaimDto CloseClaim(int claimId)
        {
            return UpdateStatus(claimId, ClaimStatus.Closed, 0);
        }

        public ClaimDto GetById(int claimId)
        {
            var claim = _unitOfWork.Claims.GetById(claimId);
            return claim == null ? null : MapToDto(claim);
        }

        public IEnumerable<ClaimDto> GetByPolicy(int policyId)
        {
            return _unitOfWork.Claims.GetByPolicy(policyId).Select(MapToDto).ToList();
        }

        public IEnumerable<ClaimDto> GetByInsured(int insuredId)
        {
            return _unitOfWork.Claims.GetByInsured(insuredId).Select(MapToDto).ToList();
        }

        public IEnumerable<ClaimDto> GetByBroker(int brokerId)
        {
            return _unitOfWork.Claims.GetByBroker(brokerId).Select(MapToDto).ToList();
        }

        private Claim GetClaimOrThrow(int claimId)
        {
            var claim = _unitOfWork.Claims.GetById(claimId);
            if (claim == null) throw new InvalidOperationException($"Claim {claimId} not found.");
            return claim;
        }

        private static ClaimDto MapToDto(Claim claim)
        {
            return new ClaimDto
            {
                Id = claim.Id,
                ClaimNumber = claim.ClaimNumber,
                PolicyId = claim.PolicyId,
                PolicyNumber = claim.Policy?.PolicyNumber,
                InsuredId = claim.InsuredId,
                InsuredName = claim.Insured?.Name,
                BrokerId = claim.BrokerId,
                BrokerName = claim.Broker?.Name,
                DateOfLoss = claim.DateOfLoss,
                DateReported = claim.DateReported,
                Description = claim.Description,
                Status = claim.Status,
                ReserveAmount = claim.ReserveAmount,
                PaidAmount = claim.PaidAmount,
                HandlerUserId = claim.HandlerUserId,
                HandlerName = claim.Handler?.FullName,
                ClosedDate = claim.ClosedDate
            };
        }
    }
}
