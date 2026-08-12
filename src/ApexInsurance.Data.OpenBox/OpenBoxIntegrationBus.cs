using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;

namespace ApexInsurance.Data.OpenBox
{
    /// <summary>
    /// Publishes Open Box domain events to RabbitMQ when enabled; always keeps an
    /// in-memory ring for the Open Box portal. Falls back to in-memory-only when
    /// the broker is unreachable (lab-friendly).
    /// </summary>
    public class OpenBoxIntegrationBus : IOpenBoxIntegrationBus, IDisposable
    {
        private readonly ConcurrentQueue<OpenBoxEventMessage> _recent = new ConcurrentQueue<OpenBoxEventMessage>();
        private readonly object _sync = new object();
        private readonly IConfiguration _configuration;
        private readonly ILogger<OpenBoxIntegrationBus> _logger;
        private readonly bool _rabbitEnabled;
        private readonly string _host;
        private readonly int _port;
        private readonly string _user;
        private readonly string _password;
        private readonly string _vhost;
        private readonly string _exchange;
        private readonly string _routingKey;
        private readonly string _queue;
        private readonly string _partyRoutingKey;
        private readonly string _partyQueue;

        private IConnection _connection;
        private IModel _channel;
        private string _lastError;

        public OpenBoxIntegrationBus(IConfiguration configuration, ILogger<OpenBoxIntegrationBus> logger)
        {
            _configuration = configuration;
            _logger = logger;
            _rabbitEnabled = string.Equals(_configuration["Apex:RabbitMQ:Enabled"], "true", StringComparison.OrdinalIgnoreCase);
            _host = _configuration["Apex:RabbitMQ:Host"] ?? "localhost";
            _port = int.TryParse(_configuration["Apex:RabbitMQ:Port"], out var p) ? p : 5672;
            _user = _configuration["Apex:RabbitMQ:Username"] ?? "guest";
            _password = _configuration["Apex:RabbitMQ:Password"] ?? "guest";
            _vhost = _configuration["Apex:RabbitMQ:VirtualHost"] ?? "/";
            _exchange = _configuration["Apex:RabbitMQ:Exchange"] ?? "apex.openbox";
            _routingKey = _configuration["Apex:RabbitMQ:RoutingKey"] ?? "obx.events";
            _queue = _configuration["Apex:RabbitMQ:Queue"] ?? "apex.workbench.obx";
            _partyRoutingKey = _configuration["Apex:RabbitMQ:PartyRoutingKey"] ?? "party.insured";
            _partyQueue = _configuration["Apex:RabbitMQ:PartyQueue"] ?? "apex.workbench.insured";

            if (_rabbitEnabled)
            {
                TryConnect();
            }
        }

        public string Mode => IsRabbitLive() ? "RabbitMQ" : "InMemory";

        public string Endpoint => IsRabbitLive()
            ? $"amqp://{_host}:{_port}/{_vhost} · {_exchange}/{_routingKey}+{_partyRoutingKey}"
            : "memory://openbox-bus";

        public void Publish(OpenBoxEventMessage message)
        {
            if (message == null) return;
            if (message.OccurredUtc == default) message.OccurredUtc = DateTime.UtcNow;

            EnqueueRecent(message);
            PublishJson(_routingKey, message.EventId, message.EventType, JsonSerializer.Serialize(message), message.EventType, message.UwReference);
        }

        public void PublishInsured(InsuredPartyMessage message)
        {
            if (message == null) return;
            if (message.OccurredUtc == default) message.OccurredUtc = DateTime.UtcNow;
            if (string.IsNullOrWhiteSpace(message.EventType)) message.EventType = "InsuredCreated";

            EnqueueRecent(new OpenBoxEventMessage
            {
                EventId = message.EventId,
                EventType = message.EventType,
                UwReference = message.ExternalId,
                OccurredUtc = message.OccurredUtc,
                Source = message.Source ?? "OpenBox",
                PayloadJson = JsonSerializer.Serialize(message)
            });

            PublishJson(_partyRoutingKey, message.EventId, message.EventType, JsonSerializer.Serialize(message), message.EventType, message.ExternalId);
        }

        private void PublishJson(string routingKey, string messageId, string type, string json, string logEventType, string logRef)
        {
            if (!IsRabbitLive() && _rabbitEnabled)
            {
                TryConnect();
            }

            if (!IsRabbitLive())
            {
                _logger?.LogDebug("Bus event {EventType} {Ref} stored in-memory only (routing {Key}).", logEventType, logRef, routingKey);
                return;
            }

            try
            {
                lock (_sync)
                {
                    var body = Encoding.UTF8.GetBytes(json);
                    var props = _channel.CreateBasicProperties();
                    props.ContentType = "application/json";
                    props.DeliveryMode = 2;
                    props.MessageId = messageId;
                    props.Type = type;
                    props.Timestamp = new AmqpTimestamp(DateTimeOffset.UtcNow.ToUnixTimeSeconds());
                    _channel.BasicPublish(_exchange, routingKey, props, body);
                }
                _logger?.LogInformation("Published {EventType} {Ref} to RabbitMQ ({Key}).", logEventType, logRef, routingKey);
            }
            catch (Exception ex)
            {
                _lastError = ex.Message;
                _logger?.LogWarning(ex, "RabbitMQ publish failed; event retained in-memory.");
                DisposeChannel();
            }
        }

        public IList<OpenBoxEventMessage> Recent(int take = 50)
        {
            take = Math.Clamp(take, 1, 200);
            return _recent.Reverse().Take(take).ToList();
        }

        public OpenBoxBusHealth Probe()
        {
            var sw = Stopwatch.StartNew();
            if (!_rabbitEnabled)
            {
                sw.Stop();
                return new OpenBoxBusHealth
                {
                    Mode = "InMemory",
                    Connected = true,
                    Endpoint = Endpoint,
                    Message = "RabbitMQ disabled — using in-process bus (set Apex:RabbitMQ:Enabled=true).",
                    ElapsedSeconds = sw.Elapsed.TotalSeconds
                };
            }

            try
            {
                if (!IsRabbitLive()) TryConnect();
                sw.Stop();
                if (IsRabbitLive())
                {
                    return new OpenBoxBusHealth
                    {
                        Mode = "RabbitMQ",
                        Connected = true,
                        Endpoint = Endpoint,
                        Message = $"Broker reachable; exchange '{_exchange}', queues '{_queue}' + '{_partyQueue}'.",
                        ElapsedSeconds = sw.Elapsed.TotalSeconds
                    };
                }

                return new OpenBoxBusHealth
                {
                    Mode = "InMemory (fallback)",
                    Connected = false,
                    Endpoint = $"amqp://{_host}:{_port}",
                    Message = "RabbitMQ enabled but unreachable: " + (_lastError ?? "connection failed") + ". Events buffered in-memory.",
                    ElapsedSeconds = sw.Elapsed.TotalSeconds
                };
            }
            catch (Exception ex)
            {
                sw.Stop();
                return new OpenBoxBusHealth
                {
                    Mode = "InMemory (fallback)",
                    Connected = false,
                    Endpoint = $"amqp://{_host}:{_port}",
                    Message = ex.Message,
                    ElapsedSeconds = sw.Elapsed.TotalSeconds
                };
            }
        }

        private bool IsRabbitLive()
        {
            return _connection != null && _connection.IsOpen && _channel != null && _channel.IsOpen;
        }

        private void TryConnect()
        {
            lock (_sync)
            {
                if (IsRabbitLive()) return;
                DisposeChannel();
                try
                {
                    var factory = new ConnectionFactory
                    {
                        HostName = _host,
                        Port = _port,
                        UserName = _user,
                        Password = _password,
                        VirtualHost = _vhost,
                        RequestedConnectionTimeout = TimeSpan.FromSeconds(3),
                        AutomaticRecoveryEnabled = true
                    };
                    _connection = factory.CreateConnection("ApexInsurance.OpenBox");
                    _channel = _connection.CreateModel();
                    _channel.ExchangeDeclare(_exchange, ExchangeType.Topic, durable: true);
                    _channel.QueueDeclare(_queue, durable: true, exclusive: false, autoDelete: false);
                    _channel.QueueBind(_queue, _exchange, _routingKey);
                    _channel.QueueDeclare(_partyQueue, durable: true, exclusive: false, autoDelete: false);
                    _channel.QueueBind(_partyQueue, _exchange, _partyRoutingKey);
                    _lastError = null;
                    _logger?.LogInformation("Connected to RabbitMQ at {Host}:{Port}", _host, _port);
                }
                catch (Exception ex)
                {
                    _lastError = ex.Message;
                    DisposeChannel();
                    _logger?.LogWarning("RabbitMQ connect failed: {Message}", ex.Message);
                }
            }
        }

        private void EnqueueRecent(OpenBoxEventMessage message)
        {
            _recent.Enqueue(message);
            while (_recent.Count > 200 && _recent.TryDequeue(out _)) { }
        }

        private void DisposeChannel()
        {
            try { _channel?.Close(); } catch { /* ignore */ }
            try { _connection?.Close(); } catch { /* ignore */ }
            _channel = null;
            _connection = null;
        }

        public void Dispose()
        {
            DisposeChannel();
        }
    }
}
