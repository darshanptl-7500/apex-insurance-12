using System;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using ApexInsurance.Data;
using ApexInsurance.Data.OpenBox;
using ApexInsurance.Domain.Entities;
using ApexInsurance.Services.Insureds;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace ApexInsurance.Api.Infrastructure
{
    /// <summary>
    /// Consumes party.insured events and upserts Insured rows (external PAS / CRM → workbench).
    /// </summary>
    public class InsuredPartyBusConsumerHostedService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IConfiguration _configuration;
        private readonly ILogger<InsuredPartyBusConsumerHostedService> _logger;
        private IConnection _connection;
        private IModel _channel;

        public InsuredPartyBusConsumerHostedService(
            IServiceScopeFactory scopeFactory,
            IConfiguration configuration,
            ILogger<InsuredPartyBusConsumerHostedService> logger)
        {
            _scopeFactory = scopeFactory;
            _configuration = configuration;
            _logger = logger;
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            if (!string.Equals(_configuration["Apex:RabbitMQ:Enabled"], "true", StringComparison.OrdinalIgnoreCase))
            {
                _logger.LogInformation("Insured party RabbitMQ consumer disabled.");
                return Task.CompletedTask;
            }

            try
            {
                StartConsumer(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Insured party RabbitMQ consumer could not start.");
            }

            return Task.CompletedTask;
        }

        private void StartConsumer(CancellationToken stoppingToken)
        {
            var host = _configuration["Apex:RabbitMQ:Host"] ?? "localhost";
            var port = int.TryParse(_configuration["Apex:RabbitMQ:Port"], out var p) ? p : 5672;
            var user = _configuration["Apex:RabbitMQ:Username"] ?? "guest";
            var password = _configuration["Apex:RabbitMQ:Password"] ?? "guest";
            var vhost = _configuration["Apex:RabbitMQ:VirtualHost"] ?? "/";
            var exchange = _configuration["Apex:RabbitMQ:Exchange"] ?? "apex.openbox";
            var routingKey = _configuration["Apex:RabbitMQ:PartyRoutingKey"] ?? "party.insured";
            var queue = _configuration["Apex:RabbitMQ:PartyQueue"] ?? "apex.workbench.insured";

            var factory = new ConnectionFactory
            {
                HostName = host,
                Port = port,
                UserName = user,
                Password = password,
                VirtualHost = vhost,
                AutomaticRecoveryEnabled = true,
                RequestedConnectionTimeout = TimeSpan.FromSeconds(3)
            };

            _connection = factory.CreateConnection("ApexInsurance.InsuredParty.Consumer");
            _channel = _connection.CreateModel();
            _channel.ExchangeDeclare(exchange, ExchangeType.Topic, durable: true);
            _channel.QueueDeclare(queue, durable: true, exclusive: false, autoDelete: false);
            _channel.QueueBind(queue, exchange, routingKey);

            var consumer = new EventingBasicConsumer(_channel);
            consumer.Received += (_, ea) =>
            {
                try
                {
                    var json = Encoding.UTF8.GetString(ea.Body.ToArray());
                    var msg = JsonSerializer.Deserialize<InsuredPartyMessage>(json);
                    using var scope = _scopeFactory.CreateScope();
                    var insuredService = scope.ServiceProvider.GetRequiredService<IInsuredService>();
                    var uow = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();

                    var result = insuredService.UpsertFromExternal(new ExternalInsuredRequest
                    {
                        EventType = msg?.EventType,
                        ExternalId = msg?.ExternalId,
                        Name = msg?.Name,
                        TradingName = msg?.TradingName,
                        RegistrationNumber = msg?.RegistrationNumber,
                        Address = msg?.Address,
                        City = msg?.City,
                        PostCode = msg?.PostCode,
                        TradeCode = msg?.TradeCode,
                        Occupancy = msg?.Occupancy,
                        OccurredUtc = msg?.OccurredUtc
                    });

                    uow.IntegrationActivities.Add(new IntegrationActivity
                    {
                        OccurredUtc = DateTime.UtcNow,
                        SystemName = "RabbitMQ",
                        Direction = "In",
                        ActionName = msg?.EventType ?? "InsuredUpsert",
                        Reference = result.Insured?.ExternalId ?? result.Insured?.Id.ToString(),
                        Status = "Success",
                        Message = (result.Created ? "Created" : "Updated") + " insured '" + result.Insured.Name + "' from party bus.",
                        ElapsedMs = 0
                    });
                    uow.SaveChanges();

                    _channel.BasicAck(ea.DeliveryTag, false);
                    _logger.LogInformation(
                        "Insured party event applied: {Action} id={Id} external={Ext}",
                        result.Created ? "Created" : "Updated",
                        result.Insured.Id,
                        result.Insured.ExternalId);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to process insured party bus message.");
                    try { _channel.BasicNack(ea.DeliveryTag, false, requeue: false); } catch { /* ignore */ }

                    try
                    {
                        using var scope = _scopeFactory.CreateScope();
                        var uow = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
                        uow.IntegrationActivities.Add(new IntegrationActivity
                        {
                            OccurredUtc = DateTime.UtcNow,
                            SystemName = "RabbitMQ",
                            Direction = "In",
                            ActionName = "InsuredUpsert",
                            Status = "Failed",
                            Message = ex.Message.Length > 900 ? ex.Message.Substring(0, 900) : ex.Message,
                            ElapsedMs = 0
                        });
                        uow.SaveChanges();
                    }
                    catch { /* ignore secondary failure */ }
                }
            };

            _channel.BasicConsume(queue, autoAck: false, consumer);
            _logger.LogInformation("Insured party RabbitMQ consumer listening on {Queue}", queue);

            stoppingToken.Register(() =>
            {
                try { _channel?.Close(); } catch { /* ignore */ }
                try { _connection?.Close(); } catch { /* ignore */ }
            });
        }

        public override void Dispose()
        {
            try { _channel?.Dispose(); } catch { /* ignore */ }
            try { _connection?.Dispose(); } catch { /* ignore */ }
            base.Dispose();
        }
    }
}
