using System;
using ApexInsurance.Domain.Enums;

namespace ApexInsurance.Services.Dto
{
    public class TeamDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int? ManagerUserId { get; set; }
        public string ManagerName { get; set; }
        public bool IsActive { get; set; }
        public int MemberCount { get; set; }
    }

    public class TradeDto
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string RiskCategory { get; set; }
        public bool IsRestricted { get; set; }
        public decimal LoadingPercent { get; set; }
    }

    public class CoverageDto
    {
        public int Id { get; set; }
        public LineOfBusiness LineOfBusiness { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsStandard { get; set; }
    }

    public class TerritoryDto
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Country { get; set; }
    }

    public class RateTableDto
    {
        public int Id { get; set; }
        public LineOfBusiness LineOfBusiness { get; set; }
        public int? TradeId { get; set; }
        public string TradeName { get; set; }
        public decimal BaseRatePer1000 { get; set; }
        public decimal MinPremium { get; set; }
        public bool IsActive { get; set; }
    }

    public class ReferralRuleDto
    {
        public int Id { get; set; }
        public LineOfBusiness LineOfBusiness { get; set; }
        public int? TradeId { get; set; }
        public string TradeName { get; set; }
        public decimal? MinSumInsured { get; set; }
        public decimal? MaxSumInsured { get; set; }
        public decimal? MinLimit { get; set; }
        public decimal? MaxLimit { get; set; }
        public bool TriggersOnRestrictedTrade { get; set; }
        public string Reason { get; set; }
        public bool IsActive { get; set; }
    }

    public class SystemParameterDto
    {
        public int Id { get; set; }
        public string Key { get; set; }
        public string Value { get; set; }
        public string Description { get; set; }
        public string DataType { get; set; }
    }

    public class HolidayDto
    {
        public int Id { get; set; }
        public DateTime HolidayDate { get; set; }
        public string Description { get; set; }
        public string CountryCode { get; set; }
    }

    public class CreateUserRequest
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string Password { get; set; }
        public UserRole Role { get; set; }
        public int? TeamId { get; set; }
        public decimal AuthorityLimit { get; set; }
    }

    public class UpdateUserRequest
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public UserRole Role { get; set; }
        public int? TeamId { get; set; }
        public decimal AuthorityLimit { get; set; }
        public bool IsActive { get; set; }
    }

    public class CreateTeamRequest
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int? ManagerUserId { get; set; }
    }

    public class RateTableRequest
    {
        public int? Id { get; set; }
        public LineOfBusiness LineOfBusiness { get; set; }
        public int? TradeId { get; set; }
        public decimal BaseRatePer1000 { get; set; }
        public decimal MinPremium { get; set; }
        public bool IsActive { get; set; }
    }

    public class ReferralRuleRequest
    {
        public int? Id { get; set; }
        public LineOfBusiness LineOfBusiness { get; set; }
        public int? TradeId { get; set; }
        public decimal? MinSumInsured { get; set; }
        public decimal? MaxSumInsured { get; set; }
        public decimal? MinLimit { get; set; }
        public decimal? MaxLimit { get; set; }
        public bool TriggersOnRestrictedTrade { get; set; }
        public string Reason { get; set; }
        public bool IsActive { get; set; }
    }

    public class AuthorityRuleDto
    {
        public int Id { get; set; }
        public UserRole Role { get; set; }
        public LineOfBusiness LineOfBusiness { get; set; }
        public decimal MaxPremium { get; set; }
        public decimal MaxSumInsured { get; set; }
        public decimal MaxLimit { get; set; }
        public bool IsActive { get; set; }
    }

    public class AuthorityRuleRequest
    {
        public int? Id { get; set; }
        public UserRole Role { get; set; }
        public LineOfBusiness LineOfBusiness { get; set; }
        public decimal MaxPremium { get; set; }
        public decimal MaxSumInsured { get; set; }
        public decimal MaxLimit { get; set; }
        public bool IsActive { get; set; }
    }

    public class SystemParameterRequest
    {
        public string Key { get; set; }
        public string Value { get; set; }
        public string Description { get; set; }
        public string DataType { get; set; }
    }
}
