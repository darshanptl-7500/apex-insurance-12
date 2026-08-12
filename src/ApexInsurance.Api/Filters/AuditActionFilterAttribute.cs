using System;
using System.Linq;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using ApexInsurance.Api.Infrastructure;
using ApexInsurance.Services.Audit;

namespace ApexInsurance.Api.Filters
{
    public class AuditActionFilterAttribute : ActionFilterAttribute
    {
        private static readonly string[] AuditedMethods = { "POST", "PUT", "PATCH", "DELETE" };

        public override void OnActionExecuted(ActionExecutedContext context)
        {
            base.OnActionExecuted(context);

            try
            {
                WriteAuditEntryIfApplicable(context);
            }
            catch (Exception ex)
            {
                var logger = context.HttpContext.RequestServices.GetService<ILogger<AuditActionFilterAttribute>>();
                logger?.LogWarning(ex, "AuditActionFilter failed to write audit entry");
            }
        }

        private static void WriteAuditEntryIfApplicable(ActionExecutedContext context)
        {
            var request = context.HttpContext.Request;
            if (!AuditedMethods.Contains(request.Method, StringComparer.OrdinalIgnoreCase))
            {
                return;
            }

            if (context.Exception != null || context.Result == null)
            {
                return;
            }

            var statusCode = context.HttpContext.Response?.StatusCode ?? 0;
            if (context.Result is Microsoft.AspNetCore.Mvc.ObjectResult objectResult && objectResult.StatusCode.HasValue)
            {
                statusCode = objectResult.StatusCode.Value;
            }
            else if (context.Result is Microsoft.AspNetCore.Mvc.StatusCodeResult statusResult)
            {
                statusCode = statusResult.StatusCode;
            }

            if (statusCode < 200 || statusCode >= 300)
            {
                return;
            }

            var currentUser = CurrentUserContext.Get(context.HttpContext);
            var controllerName = context.Controller?.GetType().Name?.Replace("Controller", "") ?? "Unknown";
            var actionName = context.ActionDescriptor?.DisplayName ?? "Unknown";
            var entityId = ExtractRouteId(context);

            var auditService = context.HttpContext.RequestServices.GetService<IAuditService>();
            if (auditService == null)
            {
                return;
            }

            var details = JsonSerializer.Serialize(new
            {
                path = request.Path.Value + request.QueryString.Value,
                statusCode,
                username = currentUser?.Username
            });

            auditService.WriteAudit(
                entityName: controllerName,
                entityId: entityId,
                action: $"{request.Method} {actionName}",
                userId: currentUser?.UserId,
                details: details);
        }

        private static int ExtractRouteId(ActionExecutedContext context)
        {
            if (context.ActionDescriptor is Microsoft.AspNetCore.Mvc.Controllers.ControllerActionDescriptor cad)
            {
                // Prefer route values
            }

            if (context.HttpContext.Request.RouteValues.TryGetValue("id", out var idValue)
                && idValue != null
                && int.TryParse(idValue.ToString(), out var intId))
            {
                return intId;
            }

            return 0;
        }
    }
}
