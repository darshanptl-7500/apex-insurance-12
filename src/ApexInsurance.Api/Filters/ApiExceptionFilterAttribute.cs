using System;
using System.Collections.Generic;
using System.Net;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using ApexInsurance.Api.Infrastructure;

namespace ApexInsurance.Api.Filters
{
    public class ApiExceptionFilterAttribute : ExceptionFilterAttribute
    {
        public override void OnException(ExceptionContext context)
        {
            var exception = context.Exception;
            var (statusCode, message) = Classify(exception);

            var logger = context.HttpContext.RequestServices.GetService<ILogger<ApiExceptionFilterAttribute>>();
            logger?.LogError(exception, "Unhandled exception on {Method} {Path}",
                context.HttpContext.Request.Method,
                context.HttpContext.Request.Path);

            var env = context.HttpContext.RequestServices.GetService<IWebHostEnvironment>();
            var includeDetail = env?.IsDevelopment() == true;

            context.Result = new ObjectResult(new
            {
                error = statusCode.ToString(),
                message,
                detail = includeDetail ? exception.ToString() : null
            })
            {
                StatusCode = (int)statusCode
            };

            context.ExceptionHandled = true;
        }

        private static (HttpStatusCode StatusCode, string Message) Classify(Exception exception)
        {
            switch (exception)
            {
                case ApexApiException apexException:
                    return (apexException.StatusCode, apexException.Message);

                case ArgumentException argumentException:
                    return (HttpStatusCode.BadRequest, argumentException.Message);

                case UnauthorizedAccessException _:
                    return (HttpStatusCode.Unauthorized, "You are not authorized to perform this action.");

                case KeyNotFoundException _:
                    return (HttpStatusCode.NotFound, exception.Message);

                case InvalidOperationException invalidOperationException:
                    return invalidOperationException.Message.IndexOf("not found", StringComparison.OrdinalIgnoreCase) >= 0
                        ? (HttpStatusCode.NotFound, invalidOperationException.Message)
                        : (HttpStatusCode.Conflict, invalidOperationException.Message);

                default:
                    return (HttpStatusCode.InternalServerError,
                        "An unexpected error occurred while processing your request. Please try again or contact support if the problem persists.");
            }
        }
    }
}
