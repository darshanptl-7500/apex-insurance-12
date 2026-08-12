using Microsoft.AspNetCore.Http;
using ApexInsurance.Services.Dto;

namespace ApexInsurance.Api.Infrastructure
{
    /// <summary>
    /// Stashes the decoded demo bearer token payload on <see cref="HttpContext.Items"/>
    /// once <see cref="ApexInsurance.Api.Filters.AuthorizeRoleAttribute"/> validates the
    /// Authorization header.
    /// </summary>
    public static class CurrentUserContext
    {
        private const string ItemsKey = "Apex.CurrentUser";

        public static void Set(HttpContext httpContext, TokenPayload payload)
        {
            if (httpContext == null)
            {
                return;
            }

            httpContext.Items[ItemsKey] = payload;
        }

        public static TokenPayload Get(HttpContext httpContext)
        {
            if (httpContext != null && httpContext.Items.TryGetValue(ItemsKey, out var value))
            {
                return value as TokenPayload;
            }

            return null;
        }

        public static bool TryExtractBearerToken(HttpContext httpContext, out string token)
        {
            token = null;
            if (httpContext?.Request == null)
            {
                return false;
            }

            var header = httpContext.Request.Headers["Authorization"].ToString();
            if (!string.IsNullOrWhiteSpace(header))
            {
                const string prefix = "Bearer ";
                if (header.StartsWith(prefix, System.StringComparison.OrdinalIgnoreCase))
                {
                    token = header.Substring(prefix.Length).Trim();
                    if (!string.IsNullOrWhiteSpace(token))
                    {
                        return true;
                    }
                }
            }

            // Browser navigations (window.open / <iframe> / <a href>) cannot set
            // Authorization headers — accept a query token for downloads/previews.
            var query = httpContext.Request.Query;
            var queryToken = query["access_token"].ToString();
            if (string.IsNullOrWhiteSpace(queryToken))
            {
                queryToken = query["token"].ToString();
            }

            if (!string.IsNullOrWhiteSpace(queryToken))
            {
                token = queryToken.Trim();
                return true;
            }

            return false;
        }
    }
}
