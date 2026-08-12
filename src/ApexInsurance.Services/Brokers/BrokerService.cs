using System;
using System.Linq;
using ApexInsurance.Data;
using ApexInsurance.Domain.Entities;
using ApexInsurance.Domain.Enums;

namespace ApexInsurance.Services.Brokers
{
    public class BrokerService : IBrokerService
    {
        private readonly IUnitOfWork _unitOfWork;

        public BrokerService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        }

        public PagedBrokers List(string search = null, bool? isActive = null, int page = 1, int pageSize = 25)
        {
            page = Math.Max(page, 1);
            pageSize = Math.Max(pageSize, 1);

            var query = _unitOfWork.Brokers.Query();
            if (isActive.HasValue)
            {
                query = query.Where(b => b.IsActive == isActive.Value);
            }
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(b =>
                    b.Name.Contains(search) ||
                    b.BrokerCode.Contains(search));
            }

            var total = query.Count();
            var items = query
                .OrderBy(b => b.Name)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return new PagedBrokers
            {
                Items = items,
                TotalCount = total,
                Page = page,
                PageSize = pageSize
            };
        }

        public Broker GetById(int id)
        {
            return _unitOfWork.Brokers.GetById(id);
        }

        public Broker Create(CreateBrokerRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));
            if (string.IsNullOrWhiteSpace(request.Name))
                throw new InvalidOperationException("Broker name is required.");
            if (string.IsNullOrWhiteSpace(request.BrokerCode))
                throw new InvalidOperationException("Broker code is required.");

            var code = request.BrokerCode.Trim().ToUpperInvariant();
            if (_unitOfWork.Brokers.Query().Any(b => b.BrokerCode == code))
                throw new InvalidOperationException($"Broker code '{code}' is already in use.");

            var broker = new Broker
            {
                Name = request.Name.Trim(),
                BrokerCode = code,
                ContactEmail = request.ContactEmail,
                ContactPhone = request.ContactPhone,
                Address = request.Address,
                AgreementRef = request.AgreementRef,
                ProductionTarget = request.ProductionTarget,
                IsActive = true
            };

            _unitOfWork.Brokers.Add(broker);
            _unitOfWork.SaveChanges();
            return broker;
        }

        public Broker Update(UpdateBrokerRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));

            var broker = _unitOfWork.Brokers.GetById(request.Id)
                ?? throw new InvalidOperationException($"Broker {request.Id} not found.");

            if (string.IsNullOrWhiteSpace(request.Name))
                throw new InvalidOperationException("Broker name is required.");

            broker.Name = request.Name.Trim();
            broker.ContactEmail = request.ContactEmail;
            broker.ContactPhone = request.ContactPhone;
            broker.Address = request.Address;
            broker.AgreementRef = request.AgreementRef;
            broker.ProductionTarget = request.ProductionTarget;
            broker.IsActive = request.IsActive;

            _unitOfWork.Brokers.Update(broker);
            _unitOfWork.SaveChanges();
            return broker;
        }

        public Broker Deactivate(int id)
        {
            var broker = _unitOfWork.Brokers.GetById(id)
                ?? throw new InvalidOperationException($"Broker {id} not found.");

            broker.IsActive = false;
            _unitOfWork.Brokers.Update(broker);
            _unitOfWork.SaveChanges();
            return broker;
        }

        public BrokerPerformanceDto GetPerformance(int brokerId)
        {
            var broker = _unitOfWork.Brokers.GetById(brokerId)
                ?? throw new InvalidOperationException($"Broker {brokerId} not found.");

            var submissions = _unitOfWork.Submissions.Query().Where(s => s.BrokerId == brokerId).ToList();
            var policies = _unitOfWork.Policies.Query()
                .Where(p => p.BrokerId == brokerId && p.Status == PolicyStatus.Active)
                .ToList();
            var claims = _unitOfWork.Claims.Query().Where(c => c.BrokerId == brokerId).ToList();

            var gwp = policies.Sum(p => p.GrossPremium);
            var incurred = claims.Sum(c => c.ReserveAmount + c.PaidAmount);
            var bound = submissions.Count(s => s.Status == SubmissionStatus.Bound);

            return new BrokerPerformanceDto
            {
                BrokerId = broker.Id,
                BrokerCode = broker.BrokerCode,
                Name = broker.Name,
                SubmissionCount = submissions.Count,
                BoundCount = bound,
                GrossWrittenPremium = gwp,
                ProductionTarget = broker.ProductionTarget,
                HitRatio = submissions.Count == 0 ? 0 : Math.Round((decimal)bound / submissions.Count * 100m, 1),
                LossRatio = gwp == 0 ? 0 : Math.Round(incurred / gwp * 100m, 1)
            };
        }
    }
}
