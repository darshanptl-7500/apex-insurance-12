using System;
using ApexInsurance.Data.Repositories;
using ApexInsurance.Domain.Entities;

namespace ApexInsurance.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApexInsuranceDbContext _context;
        private bool _disposed;

        private ISubmissionRepository _submissions;
        private IPolicyRepository _policies;
        private IQuoteRepository _quotes;
        private IClaimRepository _claims;
        private IDocumentRepository _documents;
        private IBrokerRepository _brokers;
        private IUserRepository _users;
        private IDashboardRepository _dashboard;

        private IRepository<Team> _teams;
        private IRepository<Insured> _insureds;
        private IRepository<Contact> _contacts;
        private IRepository<RiskAnswer> _riskAnswers;
        private IRepository<Endorsement> _endorsements;
        private IRepository<AuthorityRule> _authorityRules;
        private IRepository<AuditLog> _auditLogs;
        private IRepository<LoginAudit> _loginAudits;
        private IRepository<DocumentAccessLog> _documentAccessLogs;
        private IRepository<WorkflowTask> _workflowTasks;
        private IRepository<TaskComment> _taskComments;
        private IRepository<Notification> _notifications;
        private IRepository<RateTable> _rateTables;
        private IRepository<ReferralRule> _referralRules;
        private IRepository<SystemParameter> _systemParameters;
        private IRepository<HolidayCalendar> _holidayCalendars;
        private IRepository<Coverage> _coverages;
        private IRepository<Territory> _territories;
        private IRepository<Trade> _trades;
        private IRepository<RiskMarketDetail> _riskMarketDetails;
        private IRepository<IntegrationActivity> _integrationActivities;
        private IRepository<ScheduledJob> _scheduledJobs;

        public UnitOfWork(ApexInsuranceDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public ISubmissionRepository Submissions => _submissions ?? (_submissions = new SubmissionRepository(_context));
        public IPolicyRepository Policies => _policies ?? (_policies = new PolicyRepository(_context));
        public IQuoteRepository Quotes => _quotes ?? (_quotes = new QuoteRepository(_context));
        public IClaimRepository Claims => _claims ?? (_claims = new ClaimRepository(_context));
        public IDocumentRepository Documents => _documents ?? (_documents = new DocumentRepository(_context));
        public IBrokerRepository Brokers => _brokers ?? (_brokers = new BrokerRepository(_context));
        public IUserRepository Users => _users ?? (_users = new UserRepository(_context));
        public IDashboardRepository Dashboard => _dashboard ?? (_dashboard = new DashboardRepository(_context));

        public IRepository<Team> Teams => _teams ?? (_teams = new Repository<Team>(_context));
        public IRepository<Insured> Insureds => _insureds ?? (_insureds = new Repository<Insured>(_context));
        public IRepository<Contact> Contacts => _contacts ?? (_contacts = new Repository<Contact>(_context));
        public IRepository<RiskAnswer> RiskAnswers => _riskAnswers ?? (_riskAnswers = new Repository<RiskAnswer>(_context));
        public IRepository<Endorsement> Endorsements => _endorsements ?? (_endorsements = new Repository<Endorsement>(_context));
        public IRepository<AuthorityRule> AuthorityRules => _authorityRules ?? (_authorityRules = new Repository<AuthorityRule>(_context));
        public IRepository<AuditLog> AuditLogs => _auditLogs ?? (_auditLogs = new Repository<AuditLog>(_context));
        public IRepository<LoginAudit> LoginAudits => _loginAudits ?? (_loginAudits = new Repository<LoginAudit>(_context));
        public IRepository<DocumentAccessLog> DocumentAccessLogs => _documentAccessLogs ?? (_documentAccessLogs = new Repository<DocumentAccessLog>(_context));
        public IRepository<WorkflowTask> WorkflowTasks => _workflowTasks ?? (_workflowTasks = new Repository<WorkflowTask>(_context));
        public IRepository<TaskComment> TaskComments => _taskComments ?? (_taskComments = new Repository<TaskComment>(_context));
        public IRepository<Notification> Notifications => _notifications ?? (_notifications = new Repository<Notification>(_context));
        public IRepository<RateTable> RateTables => _rateTables ?? (_rateTables = new Repository<RateTable>(_context));
        public IRepository<ReferralRule> ReferralRules => _referralRules ?? (_referralRules = new Repository<ReferralRule>(_context));
        public IRepository<SystemParameter> SystemParameters => _systemParameters ?? (_systemParameters = new Repository<SystemParameter>(_context));
        public IRepository<HolidayCalendar> HolidayCalendars => _holidayCalendars ?? (_holidayCalendars = new Repository<HolidayCalendar>(_context));
        public IRepository<Coverage> Coverages => _coverages ?? (_coverages = new Repository<Coverage>(_context));
        public IRepository<Territory> Territories => _territories ?? (_territories = new Repository<Territory>(_context));
        public IRepository<Trade> Trades => _trades ?? (_trades = new Repository<Trade>(_context));
        public IRepository<RiskMarketDetail> RiskMarketDetails => _riskMarketDetails ?? (_riskMarketDetails = new Repository<RiskMarketDetail>(_context));
        public IRepository<IntegrationActivity> IntegrationActivities => _integrationActivities ?? (_integrationActivities = new Repository<IntegrationActivity>(_context));
        public IRepository<ScheduledJob> ScheduledJobs => _scheduledJobs ?? (_scheduledJobs = new Repository<ScheduledJob>(_context));

        public int SaveChanges()
        {
            return _context.SaveChanges();
        }

        protected virtual void Dispose(bool disposing)
        {
            if (_disposed) return;
            if (disposing)
            {
                _context.Dispose();
            }
            _disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}
