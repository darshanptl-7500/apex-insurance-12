using System;
using ApexInsurance.Domain.Entities;
using ApexInsurance.Domain.Enums;
using ApexInsurance.Security;
using ApexInsurance.Shared;
using Xunit;

namespace ApexInsurance.Services.Tests
{
    public class SecuritySmokeTests
    {
        [Fact]
        public void DemoTokenService_IssuesAndValidatesToken()
        {
            var svc = new DemoTokenService();
            var user = new User
            {
                Id = 42,
                Username = "uw1",
                Role = UserRole.Underwriter,
                Email = "uw1@apex.test",
                FullName = "Uma Underwriter",
                IsActive = true
            };

            var token = svc.IssueToken(user);
            Assert.False(string.IsNullOrWhiteSpace(token));
            Assert.True(svc.IsValid(token));

            var payload = svc.DecodeToken(token);
            Assert.NotNull(payload);
            Assert.Equal(42, payload.UserId);
            Assert.Equal("uw1", payload.Username);
            Assert.Equal("Underwriter", payload.Role);
        }

        [Fact]
        public void DemoTokenService_RejectsGarbage()
        {
            var svc = new DemoTokenService();
            Assert.False(svc.IsValid("not-a-token"));
            Assert.Null(svc.DecodeToken(null));
        }
    }

    public class SharedSmokeTests
    {
        [Fact]
        public void Guard_NotNull_ThrowsOnNull()
        {
            Assert.Throws<ArgumentNullException>(() => Guard.NotNull<object>(null!, "x"));
            Assert.Equal("ok", Guard.NotNull("ok", "x"));
        }

        [Fact]
        public void Guard_NotBlank_ThrowsOnWhitespace()
        {
            Assert.Throws<ArgumentException>(() => Guard.NotBlank("  ", "name"));
            Assert.Equal("a", Guard.NotBlank("a", "name"));
        }
    }
}
