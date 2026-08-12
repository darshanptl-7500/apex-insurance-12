using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using ApexInsurance.Data;
using ApexInsurance.Data.OpenBox;
using ApexInsurance.Domain.Entities;
using ApexInsurance.Services.Dto;
using Microsoft.Extensions.Configuration;

namespace ApexInsurance.Services.Support
{
    public class SupportHealthService : ISupportHealthService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;
        private readonly IOpenBoxGateway _openBox;
        private readonly IOpenBoxIntegrationBus _bus;

        public SupportHealthService(
            IUnitOfWork unitOfWork,
            IConfiguration configuration,
            IOpenBoxGateway openBox,
            IOpenBoxIntegrationBus bus)
        {
            _unitOfWork = unitOfWork;
            _configuration = configuration;
            _openBox = openBox;
            _bus = bus;
        }

        public IList<HealthCheckItemDto> RunChecks()
        {
            return new List<HealthCheckItemDto>
            {
                CheckDatabase(),
                CheckDocuments(),
                CheckRating(),
                CheckOpenBoxStub(),
                CheckRabbitMq(),
                StubCheck("DM22 / DMS", "Documents management store (stub)", "dm22://lab"),
                StubCheck("Dynamics CRM", "Workflow CRM connectivity (stub)", "crm://lab"),
                StubCheck("Redis Cache", "Hot-read cache (stub)", "redis://localhost:6379"),
                StubCheck("Service Link Daily", "Scheduled service-link probe (stub)", "svc-link://daily")
            };
        }

        private HealthCheckItemDto CheckDatabase()
        {
            var sw = Stopwatch.StartNew();
            try
            {
                var count = _unitOfWork.Users.Count();
                sw.Stop();
                return new HealthCheckItemDto
                {
                    Name = "Apex DB",
                    Status = "Success",
                    Message = $"User directory reachable ({count} users).",
                    ElapsedSeconds = sw.Elapsed.TotalSeconds,
                    Endpoint = "ApexInsurance SQL"
                };
            }
            catch (Exception ex)
            {
                sw.Stop();
                return Fail("Apex DB", ex.Message, "ApexInsurance SQL", sw);
            }
        }

        private HealthCheckItemDto CheckDocuments()
        {
            var sw = Stopwatch.StartNew();
            var root = _configuration["Apex:Documents:RootPath"] ?? "App_Data/Documents";
            try
            {
                var path = Path.IsPathRooted(root)
                    ? root
                    : Path.Combine(Directory.GetCurrentDirectory(), root.Replace('\\', Path.DirectorySeparatorChar));
                Directory.CreateDirectory(path);
                var probe = Path.Combine(path, ".health");
                File.WriteAllText(probe, DateTime.UtcNow.ToString("o"));
                File.Delete(probe);
                sw.Stop();
                return new HealthCheckItemDto
                {
                    Name = "Documents",
                    Status = "Success",
                    Message = "Document storage is writable.",
                    ElapsedSeconds = sw.Elapsed.TotalSeconds,
                    Endpoint = path
                };
            }
            catch (Exception ex)
            {
                sw.Stop();
                return Fail("Documents", ex.Message, root, sw);
            }
        }

        private HealthCheckItemDto CheckRating()
        {
            var sw = Stopwatch.StartNew();
            try
            {
                var tables = _unitOfWork.RateTables.Count(r => r.IsActive);
                sw.Stop();
                return new HealthCheckItemDto
                {
                    Name = "Rating",
                    Status = tables > 0 ? "Success" : "Warning",
                    Message = tables > 0
                        ? $"Rating engine ready ({tables} active rate tables)."
                        : "No active rate tables configured.",
                    ElapsedSeconds = sw.Elapsed.TotalSeconds,
                    Endpoint = "IRatingService"
                };
            }
            catch (Exception ex)
            {
                sw.Stop();
                return Fail("Rating", ex.Message, "IRatingService", sw);
            }
        }

        private HealthCheckItemDto CheckOpenBoxStub()
        {
            var sw = Stopwatch.StartNew();
            try
            {
                var available = _openBox.IsAvailable();
                var policies = available ? _openBox.PolicyCount() : 0;
                sw.Stop();
                return new HealthCheckItemDto
                {
                    Name = _openBox.Name,
                    Status = available ? "Success" : "Failed",
                    Message = available
                        ? $"In-process Open Box adapter OK ({policies} policies mirrored)."
                        : "Open Box adapter unavailable.",
                    ElapsedSeconds = sw.Elapsed.TotalSeconds,
                    Endpoint = "ApexInsurance.Data.OpenBox"
                };
            }
            catch (Exception ex)
            {
                sw.Stop();
                return Fail("OpenBox (stub)", ex.Message, "ApexInsurance.Data.OpenBox", sw);
            }
        }

        private HealthCheckItemDto CheckRabbitMq()
        {
            var health = _bus.Probe();
            return new HealthCheckItemDto
            {
                Name = "RabbitMQ / Bus",
                Status = health.Connected
                    ? (health.Mode != null && health.Mode.IndexOf("fallback", StringComparison.OrdinalIgnoreCase) >= 0 ? "Warning" : "Success")
                    : "Warning",
                Message = health.Message,
                ElapsedSeconds = health.ElapsedSeconds,
                Endpoint = health.Endpoint
            };
        }

        private static HealthCheckItemDto StubCheck(string name, string message, string endpoint)
        {
            var sw = Stopwatch.StartNew();
            sw.Stop();
            return new HealthCheckItemDto
            {
                Name = name,
                Status = "Success",
                Message = message + " — lab stub always passes.",
                ElapsedSeconds = 0.001,
                Endpoint = endpoint
            };
        }

        private static HealthCheckItemDto Fail(string name, string message, string endpoint, Stopwatch sw)
        {
            return new HealthCheckItemDto
            {
                Name = name,
                Status = "Failed",
                Message = message,
                ElapsedSeconds = sw.Elapsed.TotalSeconds,
                Endpoint = endpoint
            };
        }
    }
}
