using System;
using System.Collections.Generic;
using System.Linq;
using ApexInsurance.Data;
using ApexInsurance.Security;
using ApexInsurance.Services.Audit;
using ApexInsurance.Services.Dto;

namespace ApexInsurance.Services.Auth
{
    public class AuthService : IAuthService
    {
        /// <summary>
        /// Demo-only fallback password accepted for any seeded user when no password hash has
        /// been set up yet (mirrors the seed data documented in the project README).
        /// </summary>
        private const string DemoPassword = "Password1!";

        private readonly IUnitOfWork _unitOfWork;
        private readonly IDemoTokenService _tokenService;
        private readonly IAuditService _auditService;

        public AuthService(IUnitOfWork unitOfWork, IDemoTokenService tokenService, IAuditService auditService)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _tokenService = tokenService ?? throw new ArgumentNullException(nameof(tokenService));
            _auditService = auditService ?? throw new ArgumentNullException(nameof(auditService));
        }

        public LoginResult ValidateLogin(string username, string password, string ipAddress = null)
        {
            var user = _unitOfWork.Users.GetByUsername(username);

            if (user == null)
            {
                _auditService.WriteLoginAudit(null, username, false, ipAddress, "User not found");
                return new LoginResult { Success = false, ErrorMessage = "Invalid username or password." };
            }

            if (!user.IsActive)
            {
                _auditService.WriteLoginAudit(user.Id, username, false, ipAddress, "Account inactive");
                return new LoginResult { Success = false, ErrorMessage = "This account has been deactivated." };
            }

            var passwordOk = PasswordHasher.VerifyPassword(password, user.PasswordHash, user.PasswordSalt);

            // Legacy demo fallback: seeded accounts without a real hash accept the standard demo password.
            if (!passwordOk && string.IsNullOrEmpty(user.PasswordHash) && password == DemoPassword)
            {
                passwordOk = true;
            }

            if (!passwordOk)
            {
                _auditService.WriteLoginAudit(user.Id, username, false, ipAddress, "Invalid password");
                return new LoginResult { Success = false, ErrorMessage = "Invalid username or password." };
            }

            user.LastLoginDate = DateTime.UtcNow;
            _unitOfWork.Users.Update(user);
            _unitOfWork.SaveChanges();

            _auditService.WriteLoginAudit(user.Id, username, true, ipAddress);

            var token = _tokenService.IssueToken(user);

            return new LoginResult
            {
                Success = true,
                Token = token,
                User = MapToDto(user)
            };
        }

        public UserDto GetUserById(int userId)
        {
            var user = _unitOfWork.Users.GetById(userId);
            return user == null ? null : MapToDto(user);
        }

        public IEnumerable<UserDto> GetUsers(bool activeOnly = true)
        {
            var users = activeOnly ? _unitOfWork.Users.GetActive() : _unitOfWork.Users.GetAll();
            return users.Select(MapToDto).ToList();
        }

        private static UserDto MapToDto(Domain.Entities.User user)
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
    }
}
