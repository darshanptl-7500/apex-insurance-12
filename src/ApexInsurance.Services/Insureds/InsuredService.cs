using System;
using System.Collections.Generic;
using System.Linq;
using ApexInsurance.Data;
using ApexInsurance.Domain.Entities;

namespace ApexInsurance.Services.Insureds
{
    public class InsuredService : IInsuredService
    {
        private readonly IUnitOfWork _unitOfWork;

        public InsuredService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        }

        public PagedInsureds List(string search = null, int page = 1, int pageSize = 25)
        {
            page = Math.Max(page, 1);
            pageSize = Math.Max(pageSize, 1);

            var query = _unitOfWork.Insureds.Query();
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(i =>
                    i.Name.Contains(search) ||
                    (i.TradingName != null && i.TradingName.Contains(search)) ||
                    (i.RegistrationNumber != null && i.RegistrationNumber.Contains(search)) ||
                    (i.ExternalId != null && i.ExternalId.Contains(search)) ||
                    (i.PostCode != null && i.PostCode.Contains(search)));
            }

            var total = query.Count();
            var items = query.OrderBy(i => i.Name).Skip((page - 1) * pageSize).Take(pageSize).ToList();

            return new PagedInsureds
            {
                Items = items,
                TotalCount = total,
                Page = page,
                PageSize = pageSize
            };
        }

        public Insured GetById(int id)
        {
            return _unitOfWork.Insureds.GetById(id);
        }

        public IList<Insured> Search(string term, int maxResults = 20)
        {
            if (string.IsNullOrWhiteSpace(term))
            {
                return new List<Insured>();
            }

            return _unitOfWork.Insureds.Query()
                .Where(i =>
                    i.Name.Contains(term) ||
                    (i.TradingName != null && i.TradingName.Contains(term)) ||
                    (i.ExternalId != null && i.ExternalId.Contains(term)) ||
                    (i.PostCode != null && i.PostCode.Contains(term)))
                .OrderBy(i => i.Name)
                .Take(Math.Max(maxResults, 1))
                .ToList();
        }

        public InsuredUpsertResult UpsertFromExternal(ExternalInsuredRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));
            if (string.IsNullOrWhiteSpace(request.Name))
                throw new InvalidOperationException("Insured name is required.");

            var externalId = string.IsNullOrWhiteSpace(request.ExternalId)
                ? null
                : request.ExternalId.Trim();
            var reg = string.IsNullOrWhiteSpace(request.RegistrationNumber)
                ? null
                : request.RegistrationNumber.Trim();

            Insured existing = null;
            if (!string.IsNullOrEmpty(externalId))
            {
                existing = _unitOfWork.Insureds.Query()
                    .FirstOrDefault(i => i.ExternalId == externalId);
            }

            if (existing == null && !string.IsNullOrEmpty(reg))
            {
                existing = _unitOfWork.Insureds.Query()
                    .FirstOrDefault(i => i.RegistrationNumber == reg);
            }

            var tradeId = ResolveTradeId(request.TradeCode);
            var created = existing == null;

            if (created)
            {
                existing = new Insured();
                _unitOfWork.Insureds.Add(existing);
            }

            existing.Name = request.Name.Trim();
            existing.TradingName = NullIfEmpty(request.TradingName);
            existing.RegistrationNumber = reg;
            existing.ExternalId = externalId ?? existing.ExternalId;
            existing.Address = NullIfEmpty(request.Address);
            existing.City = NullIfEmpty(request.City);
            existing.PostCode = NullIfEmpty(request.PostCode);
            existing.Occupancy = NullIfEmpty(request.Occupancy);
            if (tradeId.HasValue)
            {
                existing.TradeId = tradeId;
            }

            _unitOfWork.SaveChanges();

            return new InsuredUpsertResult
            {
                Created = created,
                Insured = existing
            };
        }

        private int? ResolveTradeId(string tradeCode)
        {
            if (string.IsNullOrWhiteSpace(tradeCode))
            {
                return null;
            }

            var code = tradeCode.Trim().ToUpperInvariant();
            var trade = _unitOfWork.Trades.Query()
                .FirstOrDefault(t => t.Code == code);
            return trade?.Id;
        }

        private static string NullIfEmpty(string value)
        {
            return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
        }
    }
}
