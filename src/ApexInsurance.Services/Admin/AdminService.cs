using System;
using System.Collections.Generic;
using System.Linq;
using ApexInsurance.Data;
using ApexInsurance.Domain.Entities;
using ApexInsurance.Domain.Enums;
using ApexInsurance.Services.Audit;
using ApexInsurance.Services.Auth;
using ApexInsurance.Services.Dto;

namespace ApexInsurance.Services.Admin
{
    public class AdminService : IAdminService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAuditService _auditService;

        public AdminService(IUnitOfWork unitOfWork, IAuditService auditService)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _auditService = auditService ?? throw new ArgumentNullException(nameof(auditService));
        }

        public UserDto CreateUser(CreateUserRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));
            if (_unitOfWork.Users.GetByUsername(request.Username) != null)
                throw new InvalidOperationException($"Username '{request.Username}' is already taken.");

            PasswordHasher.CreateHash(request.Password, out var hash, out var salt);

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                FullName = request.FullName,
                PasswordHash = hash,
                PasswordSalt = salt,
                Role = request.Role,
                TeamId = request.TeamId,
                AuthorityLimit = request.AuthorityLimit,
                IsActive = true,
                CreatedDate = DateTime.UtcNow
            };

            _unitOfWork.Users.Add(user);
            _unitOfWork.SaveChanges();

            _auditService.WriteAudit("User", user.Id, "Created", null, newValue: user.Username);

            return MapToDto(user);
        }

        public UserDto UpdateUser(UpdateUserRequest request)
        {
            var user = _unitOfWork.Users.GetById(request.Id);
            if (user == null) throw new InvalidOperationException($"User {request.Id} not found.");

            user.Email = request.Email;
            user.FullName = request.FullName;
            user.Role = request.Role;
            user.TeamId = request.TeamId;
            user.AuthorityLimit = request.AuthorityLimit;
            user.IsActive = request.IsActive;

            _unitOfWork.Users.Update(user);
            _unitOfWork.SaveChanges();

            _auditService.WriteAudit("User", user.Id, "Updated", null);

            return MapToDto(user);
        }

        public void DeactivateUser(int userId)
        {
            var user = _unitOfWork.Users.GetById(userId);
            if (user == null) throw new InvalidOperationException($"User {userId} not found.");

            user.IsActive = false;
            _unitOfWork.Users.Update(user);
            _unitOfWork.SaveChanges();

            _auditService.WriteAudit("User", user.Id, "Deactivated", null);
        }

        public void ResetPassword(int userId, string newPassword)
        {
            var user = _unitOfWork.Users.GetById(userId);
            if (user == null) throw new InvalidOperationException($"User {userId} not found.");

            PasswordHasher.CreateHash(newPassword, out var hash, out var salt);
            user.PasswordHash = hash;
            user.PasswordSalt = salt;

            _unitOfWork.Users.Update(user);
            _unitOfWork.SaveChanges();

            _auditService.WriteAudit("User", user.Id, "PasswordReset", null);
        }

        public IEnumerable<UserDto> GetUsers(bool activeOnly = false)
        {
            var users = activeOnly ? _unitOfWork.Users.GetActive() : _unitOfWork.Users.GetAll();
            return users.Select(MapToDto).ToList();
        }

        public TeamDto CreateTeam(CreateTeamRequest request)
        {
            var team = new Team
            {
                Name = request.Name,
                Description = request.Description,
                ManagerUserId = request.ManagerUserId,
                IsActive = true
            };

            _unitOfWork.Teams.Add(team);
            _unitOfWork.SaveChanges();

            return MapToDto(team);
        }

        public IEnumerable<TeamDto> GetTeams()
        {
            return _unitOfWork.Teams.GetAll().Select(MapToDto).ToList();
        }

        public IEnumerable<TradeDto> GetTrades()
        {
            return _unitOfWork.Trades.GetAll()
                .Select(t => new TradeDto
                {
                    Id = t.Id,
                    Code = t.Code,
                    Name = t.Name,
                    RiskCategory = t.RiskCategory,
                    IsRestricted = t.IsRestricted,
                    LoadingPercent = t.LoadingPercent
                })
                .ToList();
        }

        public IEnumerable<CoverageDto> GetCoverages(LineOfBusiness? lineOfBusiness = null)
        {
            var coverages = lineOfBusiness.HasValue
                ? _unitOfWork.Coverages.Find(c => c.LineOfBusiness == lineOfBusiness.Value)
                : _unitOfWork.Coverages.GetAll();

            return coverages.Select(c => new CoverageDto
            {
                Id = c.Id,
                LineOfBusiness = c.LineOfBusiness,
                Code = c.Code,
                Name = c.Name,
                Description = c.Description,
                IsStandard = c.IsStandard
            }).ToList();
        }

        public IEnumerable<TerritoryDto> GetTerritories()
        {
            return _unitOfWork.Territories.GetAll()
                .Select(t => new TerritoryDto { Id = t.Id, Code = t.Code, Name = t.Name, Country = t.Country })
                .ToList();
        }

        public IEnumerable<RateTableDto> GetRateTables(LineOfBusiness? lineOfBusiness = null)
        {
            var rateTables = lineOfBusiness.HasValue
                ? _unitOfWork.RateTables.Find(r => r.LineOfBusiness == lineOfBusiness.Value)
                : _unitOfWork.RateTables.GetAll();

            return rateTables.Select(MapToDto).ToList();
        }

        public RateTableDto UpsertRateTable(RateTableRequest request)
        {
            RateTable rateTable;
            if (request.Id.HasValue)
            {
                rateTable = _unitOfWork.RateTables.GetById(request.Id.Value);
                if (rateTable == null) throw new InvalidOperationException($"Rate table {request.Id} not found.");
            }
            else
            {
                rateTable = new RateTable { EffectiveDate = DateTime.UtcNow };
                _unitOfWork.RateTables.Add(rateTable);
            }

            rateTable.LineOfBusiness = request.LineOfBusiness;
            rateTable.TradeId = request.TradeId;
            rateTable.BaseRatePer1000 = request.BaseRatePer1000;
            rateTable.MinPremium = request.MinPremium;
            rateTable.IsActive = request.IsActive;

            _unitOfWork.SaveChanges();

            return MapToDto(rateTable);
        }

        public IEnumerable<ReferralRuleDto> GetReferralRules()
        {
            return _unitOfWork.ReferralRules.GetAll().Select(MapToDto).ToList();
        }

        public ReferralRuleDto UpsertReferralRule(ReferralRuleRequest request)
        {
            ReferralRule rule;
            if (request.Id.HasValue)
            {
                rule = _unitOfWork.ReferralRules.GetById(request.Id.Value);
                if (rule == null) throw new InvalidOperationException($"Referral rule {request.Id} not found.");
            }
            else
            {
                rule = new ReferralRule();
                _unitOfWork.ReferralRules.Add(rule);
            }

            rule.LineOfBusiness = request.LineOfBusiness;
            rule.TradeId = request.TradeId;
            rule.MinSumInsured = request.MinSumInsured;
            rule.MaxSumInsured = request.MaxSumInsured;
            rule.MinLimit = request.MinLimit;
            rule.MaxLimit = request.MaxLimit;
            rule.TriggersOnRestrictedTrade = request.TriggersOnRestrictedTrade;
            rule.Reason = request.Reason;
            rule.IsActive = request.IsActive;

            _unitOfWork.SaveChanges();

            return MapToDto(rule);
        }

        public IEnumerable<AuthorityRuleDto> GetAuthorityRules()
        {
            return _unitOfWork.AuthorityRules.GetAll()
                .OrderBy(r => r.Role)
                .ThenBy(r => r.LineOfBusiness)
                .Select(MapToDto)
                .ToList();
        }

        public AuthorityRuleDto UpsertAuthorityRule(AuthorityRuleRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));

            AuthorityRule rule;
            if (request.Id.HasValue)
            {
                rule = _unitOfWork.AuthorityRules.GetById(request.Id.Value);
                if (rule == null) throw new InvalidOperationException($"Authority rule {request.Id} not found.");
            }
            else
            {
                rule = new AuthorityRule();
                _unitOfWork.AuthorityRules.Add(rule);
            }

            rule.Role = request.Role;
            rule.LineOfBusiness = request.LineOfBusiness;
            rule.MaxPremium = request.MaxPremium;
            rule.MaxSumInsured = request.MaxSumInsured;
            rule.MaxLimit = request.MaxLimit;
            rule.IsActive = request.IsActive;

            _unitOfWork.SaveChanges();

            return MapToDto(rule);
        }

        public IEnumerable<SystemParameterDto> GetParameters()
        {
            return _unitOfWork.SystemParameters.GetAll()
                .Select(p => new SystemParameterDto { Id = p.Id, Key = p.Key, Value = p.Value, Description = p.Description, DataType = p.DataType })
                .ToList();
        }

        public SystemParameterDto SetParameter(SystemParameterRequest request)
        {
            var parameter = _unitOfWork.SystemParameters.FindOne(p => p.Key == request.Key);
            if (parameter == null)
            {
                parameter = new SystemParameter { Key = request.Key };
                _unitOfWork.SystemParameters.Add(parameter);
            }

            parameter.Value = request.Value;
            parameter.Description = request.Description;
            parameter.DataType = request.DataType;

            _unitOfWork.SaveChanges();

            return new SystemParameterDto
            {
                Id = parameter.Id,
                Key = parameter.Key,
                Value = parameter.Value,
                Description = parameter.Description,
                DataType = parameter.DataType
            };
        }

        public IEnumerable<HolidayDto> GetHolidays(int? year = null)
        {
            var holidays = year.HasValue
                ? _unitOfWork.HolidayCalendars.Find(h => h.HolidayDate.Year == year.Value)
                : _unitOfWork.HolidayCalendars.GetAll();

            return holidays
                .OrderBy(h => h.HolidayDate)
                .Select(h => new HolidayDto { Id = h.Id, HolidayDate = h.HolidayDate, Description = h.Description, CountryCode = h.CountryCode })
                .ToList();
        }

        public HolidayDto AddHoliday(DateTime holidayDate, string description, string countryCode)
        {
            var holiday = new HolidayCalendar
            {
                HolidayDate = holidayDate.Date,
                Description = description,
                CountryCode = countryCode
            };

            _unitOfWork.HolidayCalendars.Add(holiday);
            _unitOfWork.SaveChanges();

            return new HolidayDto { Id = holiday.Id, HolidayDate = holiday.HolidayDate, Description = holiday.Description, CountryCode = holiday.CountryCode };
        }

        private static UserDto MapToDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role,
                TeamId = user.TeamId,
                TeamName = user.Team?.Name,
                IsActive = user.IsActive,
                AuthorityLimit = user.AuthorityLimit,
                LastLoginDate = user.LastLoginDate
            };
        }

        private static TeamDto MapToDto(Team team)
        {
            return new TeamDto
            {
                Id = team.Id,
                Name = team.Name,
                Description = team.Description,
                ManagerUserId = team.ManagerUserId,
                ManagerName = team.Manager?.FullName,
                IsActive = team.IsActive,
                MemberCount = team.Members?.Count ?? 0
            };
        }

        private static RateTableDto MapToDto(RateTable rateTable)
        {
            return new RateTableDto
            {
                Id = rateTable.Id,
                LineOfBusiness = rateTable.LineOfBusiness,
                TradeId = rateTable.TradeId,
                TradeName = rateTable.Trade?.Name,
                BaseRatePer1000 = rateTable.BaseRatePer1000,
                MinPremium = rateTable.MinPremium,
                IsActive = rateTable.IsActive
            };
        }

        private static ReferralRuleDto MapToDto(ReferralRule rule)
        {
            return new ReferralRuleDto
            {
                Id = rule.Id,
                LineOfBusiness = rule.LineOfBusiness,
                TradeId = rule.TradeId,
                TradeName = rule.Trade?.Name,
                MinSumInsured = rule.MinSumInsured,
                MaxSumInsured = rule.MaxSumInsured,
                MinLimit = rule.MinLimit,
                MaxLimit = rule.MaxLimit,
                TriggersOnRestrictedTrade = rule.TriggersOnRestrictedTrade,
                Reason = rule.Reason,
                IsActive = rule.IsActive
            };
        }

        private static AuthorityRuleDto MapToDto(AuthorityRule rule)
        {
            return new AuthorityRuleDto
            {
                Id = rule.Id,
                Role = rule.Role,
                LineOfBusiness = rule.LineOfBusiness,
                MaxPremium = rule.MaxPremium,
                MaxSumInsured = rule.MaxSumInsured,
                MaxLimit = rule.MaxLimit,
                IsActive = rule.IsActive
            };
        }
    }
}
