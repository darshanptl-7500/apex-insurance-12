using System;
using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ApexInsurance.Api.Filters;
using ApexInsurance.Data;
using ApexInsurance.Services.Admin;
using ApexInsurance.Services.Audit;
using ApexInsurance.Data.OpenBox;
using ApexInsurance.Security;
using ApexInsurance.Services.Auth;
using ApexInsurance.Services.Authority;
using ApexInsurance.Services.Brokers;
using ApexInsurance.Services.Claims;
using ApexInsurance.Services.Dashboard;
using ApexInsurance.Services.Documents;
using ApexInsurance.Services.Insureds;
using ApexInsurance.Services.Modelling;
using ApexInsurance.Services.Pipeline;
using ApexInsurance.Services.Policies;
using ApexInsurance.Services.Quotes;
using ApexInsurance.Services.Rating;
using ApexInsurance.Services.Reporting;
using ApexInsurance.Services.Support;
using ApexInsurance.Services.Workbench;
using ApexInsurance.Services.Workflow;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseUrls("http://localhost:52840");

builder.Services.AddControllers(options =>
{
    options.Filters.Add<ApiExceptionFilterAttribute>();
    options.Filters.Add<AuditActionFilterAttribute>();
    options.Filters.Add(new AuthorizeRoleAttribute());
})
.AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    options.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
});

var allowedOrigins = builder.Configuration["Apex:Cors:AllowedOrigins"]
    ?? "http://localhost:4200,http://localhost:4201";
var origins = allowedOrigins.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(origins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var connectionString = builder.Configuration.GetConnectionString("ApexInsurance")
    ?? throw new InvalidOperationException("Connection string 'ApexInsurance' is not configured.");

builder.Services.AddDbContext<ApexInsuranceDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddSingleton<IOpenBoxIntegrationBus, OpenBoxIntegrationBus>();
builder.Services.AddScoped<IOpenBoxGateway, LocalOpenBoxGateway>();
builder.Services.AddHostedService<ApexInsurance.Api.Infrastructure.OpenBoxBusConsumerHostedService>();
builder.Services.AddHostedService<ApexInsurance.Api.Infrastructure.InsuredPartyBusConsumerHostedService>();
builder.Services.AddSingleton<IDemoTokenService, DemoTokenService>();
builder.Services.AddScoped<IAuditService, AuditService>();
builder.Services.AddScoped<IAuthorityService, AuthorityService>();
builder.Services.AddScoped<IRatingService, RatingService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IClaimService, ClaimService>();
builder.Services.AddScoped<IPolicyService, PolicyService>();
builder.Services.AddScoped<IQuoteService, QuoteService>();
builder.Services.AddScoped<IReportingService, ReportingService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IWorkflowService, WorkflowService>();
builder.Services.AddScoped<IBrokerService, BrokerService>();
builder.Services.AddScoped<IInsuredService, InsuredService>();
builder.Services.AddScoped<IModellingService, ModellingService>();
builder.Services.AddScoped<IPipelineService, PipelineService>();
builder.Services.AddScoped<IUnderwriterFileService, UnderwriterFileService>();
builder.Services.AddScoped<ISupportHealthService, SupportHealthService>();

builder.Services.AddScoped<IDocumentService>(sp =>
{
    var uow = sp.GetRequiredService<IUnitOfWork>();
    var audit = sp.GetRequiredService<IAuditService>();
    var config = sp.GetRequiredService<IConfiguration>();
    var env = sp.GetRequiredService<IWebHostEnvironment>();

    var configuredPath = config["Apex:Documents:RootPath"] ?? config["DocumentStoragePath"];
    string storageRoot;
    if (string.IsNullOrWhiteSpace(configuredPath))
    {
        storageRoot = Path.Combine(env.ContentRootPath, "App_Data", "Documents");
    }
    else if (Path.IsPathRooted(configuredPath))
    {
        storageRoot = configuredPath;
    }
    else
    {
        storageRoot = Path.Combine(env.ContentRootPath, configuredPath.Replace('\\', Path.DirectorySeparatorChar));
    }

    return new DocumentService(uow, audit, storageRoot);
});

var app = builder.Build();

EnsureInsuredExternalIdColumn(app);

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseCors();
app.UseRouting();
app.MapControllers();

app.Run();

static void EnsureInsuredExternalIdColumn(WebApplication app)
{
    try
    {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApexInsuranceDbContext>();

        // Separate batches: SQL Server cannot reference a column added earlier in the same batch.
        db.Database.ExecuteSqlRaw(@"
IF COL_LENGTH('dbo.Insureds', 'ExternalId') IS NULL
    ALTER TABLE dbo.Insureds ADD ExternalId NVARCHAR(80) NULL;
");

        db.Database.ExecuteSqlRaw(@"
IF COL_LENGTH('dbo.Insureds', 'ExternalId') IS NOT NULL
   AND NOT EXISTS (
        SELECT 1 FROM sys.indexes
        WHERE name = N'UX_Insureds_ExternalId' AND object_id = OBJECT_ID(N'dbo.Insureds')
   )
    CREATE UNIQUE INDEX UX_Insureds_ExternalId ON dbo.Insureds(ExternalId) WHERE ExternalId IS NOT NULL;
");
    }
    catch (Exception ex)
    {
        Console.WriteLine("Warning: could not ensure Insureds.ExternalId column: " + ex.Message);
    }
}
