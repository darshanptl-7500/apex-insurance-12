using ApexInsurance.Domain.Entities;
using ApexInsurance.Services.Dto;

namespace ApexInsurance.Security
{
    /// <summary>
    /// Legacy-style API token issuer (UW Web.Security equivalent).
    /// Base64-encoded JSON payload for the demo Bearer header — not production JWT.
    /// </summary>
    public interface IDemoTokenService
    {
        string IssueToken(User user);
        TokenPayload DecodeToken(string token);
        bool IsValid(string token);
    }
}
