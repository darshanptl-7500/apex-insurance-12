using System.Net;
using Microsoft.AspNetCore.Mvc;
using ApexInsurance.Api.Filters;
using ApexInsurance.Services.Auth;
using ApexInsurance.Services.Dto;

namespace ApexInsurance.Api.Controllers
{
    /// <summary>
    /// Thin wrapper over <see cref="IAuthService"/>, which owns credential validation,
    /// login auditing, and demo bearer-token issuance via <c>ApexInsurance.Security.IDemoTokenService</c>.
    /// </summary>
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ApexApiControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [ApexAllowAnonymous]
        [HttpPost]
        [Route("login")]
        public IActionResult Login(LoginRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest("Username and password are required.");
            }

            var result = _authService.ValidateLogin(request.Username, request.Password, ClientIpAddress);

            if (!result.Success)
            {
                return StatusCode((int)HttpStatusCode.Unauthorized, new
                {
                    error = "Unauthorized",
                    message = result.ErrorMessage
                });
            }

            return Ok(result);
        }

        [AuthorizeRole]
        [HttpGet]
        [Route("me")]
        public IActionResult Me()
        {
            var user = _authService.GetUserById(CurrentUserId);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }
    }
}
