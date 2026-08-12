using System;
using ApexInsurance.Data.Repositories;
using ApexInsurance.Domain.Entities;

namespace ApexInsurance.Data
{
    /// <summary>
    /// Aggregates repositories over a single <see cref="ApexInsuranceDbContext"/> instance and
    /// wraps SaveChanges so services can compose multi-entity operations in one transaction.
    /// </summary>
    public interface IUnitOfWork : IDisposable
    {
        ISubmissionRepository Submissions { get; }
        IPolicyRepository Policies { get; }
        IQuoteRepository Quotes { get; }
        IClaimRepository Claims { get; }
        IDocumentRepository Documents { get; }
        IBrokerRepository Brokers { get; }
        IUserRepository Users { get; }
        IDashboardRepository Dashboard { get; }

        IRepository<Team> Teams { get; }
        IRepository<Insured> Insureds { get; }
        IRepository<Contact> Contacts { get; }
        IRepository<RiskAnswer> RiskAnswers { get; }
        IRepository<Endorsement> Endorsements { get; }
        IRepository<AuthorityRule> AuthorityRules { get; }
        IRepository<AuditLog> AuditLogs { get; }
        IRepository<LoginAudit> LoginAudits { get; }
        IRepository<DocumentAccessLog> DocumentAccessLogs { get; }
        IRepository<WorkflowTask> WorkflowTasks { get; }
        IRepository<TaskComment> TaskComments { get; }
        IRepository<Notification> Notifications { get; }
        IRepository<RateTable> RateTables { get; }
        IRepository<ReferralRule> ReferralRules { get; }
        IRepository<SystemParameter> SystemParameters { get; }
        IRepository<HolidayCalendar> HolidayCalendars { get; }
        IRepository<Coverage> Coverages { get; }
        IRepository<Territory> Territories { get; }
        IRepository<Trade> Trades { get; }
        IRepository<RiskMarketDetail> RiskMarketDetails { get; }
        IRepository<IntegrationActivity> IntegrationActivities { get; }
        IRepository<ScheduledJob> ScheduledJobs { get; }

        int SaveChanges();
    }
}
