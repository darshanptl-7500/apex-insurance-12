using Microsoft.AspNetCore.Mvc;
using ApexInsurance.Api.Infrastructure;
using ApexInsurance.Services.Dto;

namespace ApexInsurance.Api.Controllers
{
    /// <summary>
    /// Common helpers shared by every controller: current-user access (populated by
    /// <see cref="ApexInsurance.Api.Filters.AuthorizeRoleAttribute"/>) and client IP.
    /// </summary>
    [ApiController]
    public abstract class ApexApiControllerBase : ControllerBase
    {
        protected TokenPayload CurrentUser => CurrentUserContext.Get(HttpContext);

        protected int CurrentUserId => CurrentUser?.UserId ?? 0;

        protected string ClientIpAddress =>
            HttpContext?.Connection?.RemoteIpAddress?.ToString() ?? "unknown";
    }
}
