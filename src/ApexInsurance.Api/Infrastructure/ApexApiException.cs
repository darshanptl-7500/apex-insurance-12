using System;
using System.Net;

namespace ApexInsurance.Api.Infrastructure
{
    /// <summary>
    /// Base type for exceptions that carry an explicit HTTP status code, so
    /// <see cref="ApexInsurance.Api.Filters.ApiExceptionFilterAttribute"/> can translate service/
    /// domain-layer failures into meaningful JSON error responses instead of generic 500s.
    /// Services are not required to throw these directly - plain <see cref="ArgumentException"/>,
    /// <see cref="InvalidOperationException"/>, etc. are also mapped by the filter - but using
    /// these gives precise control over the resulting status code and message.
    /// </summary>
    public class ApexApiException : Exception
    {
        public HttpStatusCode StatusCode { get; }

        public ApexApiException(HttpStatusCode statusCode, string message) : base(message)
        {
            StatusCode = statusCode;
        }

        public ApexApiException(HttpStatusCode statusCode, string message, Exception innerException)
            : base(message, innerException)
        {
            StatusCode = statusCode;
        }
    }

    public class ApexNotFoundException : ApexApiException
    {
        public ApexNotFoundException(string message) : base(HttpStatusCode.NotFound, message)
        {
        }
    }

    public class ApexValidationException : ApexApiException
    {
        public ApexValidationException(string message) : base(HttpStatusCode.BadRequest, message)
        {
        }
    }

    public class ApexForbiddenException : ApexApiException
    {
        public ApexForbiddenException(string message) : base(HttpStatusCode.Forbidden, message)
        {
        }
    }

    public class ApexConflictException : ApexApiException
    {
        public ApexConflictException(string message) : base(HttpStatusCode.Conflict, message)
        {
        }
    }
}
