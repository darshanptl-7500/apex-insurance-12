using System;
using System.Text;
using System.Text.Json;
using ApexInsurance.Domain.Entities;
using ApexInsurance.Services.Dto;

namespace ApexInsurance.Security
{
    public class DemoTokenService : IDemoTokenService
    {
        private static readonly TimeSpan TokenLifetime = TimeSpan.FromHours(8);
        private static readonly JsonSerializerOptions JsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        public string IssueToken(User user)
        {
            if (user == null) throw new ArgumentNullException(nameof(user));

            var payload = new TokenPayload
            {
                UserId = user.Id,
                Username = user.Username,
                Role = user.Role.ToString(),
                Exp = ToUnixTimestamp(DateTime.UtcNow.Add(TokenLifetime))
            };

            var json = JsonSerializer.Serialize(payload, JsonOptions);
            var bytes = Encoding.UTF8.GetBytes(json);
            return Convert.ToBase64String(bytes);
        }

        public TokenPayload DecodeToken(string token)
        {
            if (string.IsNullOrWhiteSpace(token)) return null;

            try
            {
                var bytes = Convert.FromBase64String(token);
                var json = Encoding.UTF8.GetString(bytes);
                return JsonSerializer.Deserialize<TokenPayload>(json, JsonOptions);
            }
            catch
            {
                return null;
            }
        }

        public bool IsValid(string token)
        {
            var payload = DecodeToken(token);
            if (payload == null) return false;
            return payload.Exp >= ToUnixTimestamp(DateTime.UtcNow);
        }

        private static long ToUnixTimestamp(DateTime dateTime)
        {
            var epoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            return (long)(dateTime - epoch).TotalSeconds;
        }
    }
}
