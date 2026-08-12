using System;
using System.Collections.Generic;
using ApexInsurance.Domain.Enums;
using ApexInsurance.Services.Dto;

namespace ApexInsurance.Services.Admin
{
    public interface IAdminService
    {
        // Users
        UserDto CreateUser(CreateUserRequest request);
        UserDto UpdateUser(UpdateUserRequest request);
        void DeactivateUser(int userId);
        void ResetPassword(int userId, string newPassword);
        IEnumerable<UserDto> GetUsers(bool activeOnly = false);

        // Teams
        TeamDto CreateTeam(CreateTeamRequest request);
        IEnumerable<TeamDto> GetTeams();

        // Reference data
        IEnumerable<TradeDto> GetTrades();
        IEnumerable<CoverageDto> GetCoverages(LineOfBusiness? lineOfBusiness = null);
        IEnumerable<TerritoryDto> GetTerritories();

        // Rate tables
        IEnumerable<RateTableDto> GetRateTables(LineOfBusiness? lineOfBusiness = null);
        RateTableDto UpsertRateTable(RateTableRequest request);

        // Referral rules
        IEnumerable<ReferralRuleDto> GetReferralRules();
        ReferralRuleDto UpsertReferralRule(ReferralRuleRequest request);

        // Authority rules (role × LOB binding ceilings)
        IEnumerable<AuthorityRuleDto> GetAuthorityRules();
        AuthorityRuleDto UpsertAuthorityRule(AuthorityRuleRequest request);

        // System parameters
        IEnumerable<SystemParameterDto> GetParameters();
        SystemParameterDto SetParameter(SystemParameterRequest request);

        // Holiday calendar
        IEnumerable<HolidayDto> GetHolidays(int? year = null);
        HolidayDto AddHoliday(DateTime holidayDate, string description, string countryCode);
    }
}
