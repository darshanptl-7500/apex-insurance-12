using System;
using System.Linq;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using ApexInsurance.Api.Infrastructure;
using ApexInsurance.Domain.Enums;
using ApexInsurance.Security;

namespace ApexInsurance.Api.Filters
{
    /// <summary>
    /// Validates the Authorization: Bearer header and optionally enforces roles.
    /// </summary>
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false, Inherited = true)]
    public class AuthorizeRoleAttribute : Attribute, IAuthorizationFilter
    {
        private readonly UserRole[] _allowedRoles;
        private readonly IDemoTokenService _tokenService;

        public AuthorizeRoleAttribute(params UserRole[] allowedRoles)
        {
            _allowedRoles = allowedRoles ?? Array.Empty<UserRole>();
            _tokenService = new DemoTokenService();
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            if (IsAnonymousAllowed(context))
            {
                return;
            }

            var httpContext = context.HttpContext;

            if (!CurrentUserContext.TryExtractBearerToken(httpContext, out var token))
            {
                Reject(context, HttpStatusCode.Unauthorized,
                    "Missing or malformed credentials. Expected 'Authorization: Bearer {token}' or '?access_token='.");
                return;
            }

            if (!_tokenService.IsValid(token))
            {
                Reject(context, HttpStatusCode.Unauthorized, "Bearer token is invalid or has expired. Please log in again.");
                return;
            }

            var payload = _tokenService.DecodeToken(token);

            if (_allowedRoles.Length > 0)
            {
                if (!Enum.TryParse<UserRole>(payload.Role, true, out var role) || !_allowedRoles.Contains(role))
                {
                    Reject(context, HttpStatusCode.Forbidden,
                        $"Role '{payload.Role}' is not permitted to access this resource. Required role(s): {string.Join(", ", _allowedRoles)}.");
                    return;
                }
            }

            CurrentUserContext.Set(httpContext, payload);
        }

        private static bool IsAnonymousAllowed(AuthorizationFilterContext context)
        {
            if (context.ActionDescriptor is Microsoft.AspNetCore.Mvc.Controllers.ControllerActionDescriptor cad)
            {
                if (cad.MethodInfo.GetCustomAttributes(typeof(ApexAllowAnonymousAttribute), true).Any())
                {
                    return true;
                }

                if (cad.ControllerTypeInfo.GetCustomAttributes(typeof(ApexAllowAnonymousAttribute), true).Any())
                {
                    return true;
                }
            }

            return context.ActionDescriptor.EndpointMetadata.OfType<ApexAllowAnonymousAttribute>().Any();
        }

        private static void Reject(AuthorizationFilterContext context, HttpStatusCode statusCode, string message)
        {
            context.Result = new ObjectResult(new
            {
                error = statusCode.ToString(),
                message
            })
            {
                StatusCode = (int)statusCode
            };
        }
    }
}
