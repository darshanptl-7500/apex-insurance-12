using System;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using ApexInsurance.Data;
using ApexInsurance.Data.OpenBox;
using ApexInsurance.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace ApexInsurance.Api.Infrastructure
{
    /// <summary>
    /// Consumes Open Box events from RabbitMQ and records inbound integration activity
    /// (workbench ↔ OBX replication ack). No-ops when RabbitMQ is disabled/unreachable.
    /// </summary>
    public class OpenBoxBusConsumerHostedService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IConfiguration _configuration;
        private readonly ILogger<OpenBoxBusConsumerHostedService> _logger;
        private IConnection _connection;
        private IModel _channel;

        public OpenBoxBusConsumerHostedService(
            IServiceScopeFactory scopeFactory,
            IConfiguration configuration,
            ILogger<OpenBoxBusConsumerHostedService> logger)
        {
            _scopeFactory = scopeFactory;
            _configuration = configuration;
            _logger = logger;
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            if (!string.Equals(_configuration["Apex:RabbitMQ:Enabled"], "true", StringComparison.OrdinalIgnoreCase))
            {
                _logger.LogInformation("Open Box RabbitMQ consumer disabled.");
                return Task.CompletedTask;
            }

            try
            {
                StartConsumer(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Open Box RabbitMQ consumer could not start.");
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
            var routingKey = _configuration["Apex:RabbitMQ:RoutingKey"] ?? "obx.events";
            var queue = _configuration["Apex:RabbitMQ:Queue"] ?? "apex.workbench.obx";

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

            _connection = factory.CreateConnection("ApexInsurance.OpenBox.Consumer");
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
                    var msg = JsonSerializer.Deserialize<OpenBoxEventMessage>(json);
                    using var scope = _scopeFactory.CreateScope();
                    var uow = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
                    uow.IntegrationActivities.Add(new IntegrationActivity
                    {
                        OccurredUtc = DateTime.UtcNow,
                        SystemName = "RabbitMQ",
                        Direction = "In",
                        ActionName = msg?.EventType ?? "ObxEvent",
                        Reference = msg?.UwReference,
                        Status = "Success",
                        Message = "Consumed Open Box event via RabbitMQ.",
                        ElapsedMs = 0
                    });
                    uow.SaveChanges();
                    _channel.BasicAck(ea.DeliveryTag, false);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to process OBX bus message.");
                    try { _channel.BasicNack(ea.DeliveryTag, false, true); } catch { /* ignore */ }
                }
            };

            _channel.BasicConsume(queue, autoAck: false, consumer);
            _logger.LogInformation("Open Box RabbitMQ consumer listening on {Queue}", queue);

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
