using System;

namespace ApexInsurance.Api.Filters
{
    /// <summary>
    /// Marker attribute that exempts an action (or every action on a controller) from
    /// <see cref="AuthorizeRoleAttribute"/> checks. Classic Web API 2 has no built-in
    /// equivalent of ASP.NET Core's [AllowAnonymous], so we roll our own.
    /// </summary>
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = false)]
    public sealed class ApexAllowAnonymousAttribute : Attribute
    {
    }
}
