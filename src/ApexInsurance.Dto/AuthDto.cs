using System;
using ApexInsurance.Domain.Enums;

namespace ApexInsurance.Services.Dto
{
    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string IpAddress { get; set; }
    }

    public class LoginResult
    {
        public bool Success { get; set; }
        public string ErrorMessage { get; set; }
        public string Token { get; set; }
        public UserDto User { get; set; }
    }

    public class UserDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public UserRole Role { get; set; }
        public int? TeamId { get; set; }
        public string TeamName { get; set; }
        public bool IsActive { get; set; }
        public decimal AuthorityLimit { get; set; }
        public DateTime? LastLoginDate { get; set; }
    }

    /// <summary>Payload embedded in the legacy-style Base64/JSON demo API token.</summary>
    public class TokenPayload
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Role { get; set; }
        public long Exp { get; set; }
    }
}
