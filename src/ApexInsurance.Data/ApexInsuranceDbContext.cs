using Microsoft.EntityFrameworkCore;
using ApexInsurance.Domain.Entities;

namespace ApexInsurance.Data
{
    public class ApexInsuranceDbContext : DbContext
    {
        public ApexInsuranceDbContext(DbContextOptions<ApexInsuranceDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<Broker> Brokers { get; set; }
        public DbSet<Insured> Insureds { get; set; }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<Submission> Submissions { get; set; }
        public DbSet<RiskAnswer> RiskAnswers { get; set; }
        public DbSet<Quote> Quotes { get; set; }
        public DbSet<Policy> Policies { get; set; }
        public DbSet<Endorsement> Endorsements { get; set; }
        public DbSet<Claim> Claims { get; set; }
        public DbSet<Document> Documents { get; set; }
        public DbSet<AuthorityRule> AuthorityRules { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<LoginAudit> LoginAudits { get; set; }
        public DbSet<DocumentAccessLog> DocumentAccessLogs { get; set; }
        public DbSet<WorkflowTask> WorkflowTasks { get; set; }
        public DbSet<TaskComment> TaskComments { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<RateTable> RateTables { get; set; }
        public DbSet<ReferralRule> ReferralRules { get; set; }
        public DbSet<SystemParameter> SystemParameters { get; set; }
        public DbSet<HolidayCalendar> HolidayCalendars { get; set; }
        public DbSet<Coverage> Coverages { get; set; }
        public DbSet<Territory> Territories { get; set; }
        public DbSet<Trade> Trades { get; set; }
        public DbSet<RiskMarketDetail> RiskMarketDetails { get; set; }
        public DbSet<IntegrationActivity> IntegrationActivities { get; set; }
        public DbSet<ScheduledJob> ScheduledJobs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ---------------------------------------------------------------
            // Team
            // ---------------------------------------------------------------
            modelBuilder.Entity<Team>().ToTable("Teams");
            modelBuilder.Entity<Team>().HasKey(t => t.Id);
            modelBuilder.Entity<Team>().Property(t => t.Name).IsRequired().HasMaxLength(150);
            modelBuilder.Entity<Team>().Property(t => t.Description).HasMaxLength(500);
            modelBuilder.Entity<Team>()
                .HasOne(t => t.Manager)
                .WithMany()
                .HasForeignKey(t => t.ManagerUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // ---------------------------------------------------------------
            // User
            // ---------------------------------------------------------------
            modelBuilder.Entity<User>().ToTable("Users");
            modelBuilder.Entity<User>().HasKey(u => u.Id);
            modelBuilder.Entity<User>().Property(u => u.Username).IsRequired().HasMaxLength(100);
            modelBuilder.Entity<User>().Property(u => u.Email).IsRequired().HasMaxLength(200);
            modelBuilder.Entity<User>().Property(u => u.FullName).IsRequired().HasMaxLength(200);
            modelBuilder.Entity<User>().Property(u => u.PasswordHash).HasMaxLength(400);
            modelBuilder.Entity<User>().Property(u => u.PasswordSalt).HasMaxLength(400);
            modelBuilder.Entity<User>().Property(u => u.AuthorityLimit).HasPrecision(18, 2);
            modelBuilder.Entity<User>().HasIndex(u => u.Username).IsUnique();
            modelBuilder.Entity<User>()
                .HasOne(u => u.Team)
                .WithMany(t => t.Members)
                .HasForeignKey(u => u.TeamId)
                .OnDelete(DeleteBehavior.Restrict);

            // ---------------------------------------------------------------
            // Broker
            // ---------------------------------------------------------------
            modelBuilder.Entity<Broker>().ToTable("Brokers");
            modelBuilder.Entity<Broker>().HasKey(b => b.Id);
            modelBuilder.Entity<Broker>().Property(b => b.Name).IsRequired().HasMaxLength(200);
            modelBuilder.Entity<Broker>().Property(b => b.BrokerCode).IsRequired().HasMaxLength(20);
            modelBuilder.Entity<Broker>().Property(b => b.ContactEmail).HasMaxLength(200);
            modelBuilder.Entity<Broker>().Property(b => b.ContactPhone).HasMaxLength(50);
            modelBuilder.Entity<Broker>().Property(b => b.Address).HasMaxLength(500);
            modelBuilder.Entity<Broker>().HasIndex(b => b.BrokerCode).IsUnique();

            // ---------------------------------------------------------------
            // Trade / Territory / Coverage
            // ---------------------------------------------------------------
            modelBuilder.Entity<Trade>().ToTable("Trades");
            modelBuilder.Entity<Trade>().HasKey(t => t.Id);
            modelBuilder.Entity<Trade>().Property(t => t.Code).IsRequired().HasMaxLength(20);
            modelBuilder.Entity<Trade>().Property(t => t.Name).IsRequired().HasMaxLength(200);
            modelBuilder.Entity<Trade>().Property(t => t.RiskCategory).HasMaxLength(50);
            modelBuilder.Entity<Trade>().Property(t => t.LoadingPercent).HasPrecision(9, 4);

            modelBuilder.Entity<Territory>().ToTable("Territories");
            modelBuilder.Entity<Territory>().HasKey(t => t.Id);
            modelBuilder.Entity<Territory>().Property(t => t.Code).IsRequired().HasMaxLength(20);
            modelBuilder.Entity<Territory>().Property(t => t.Name).IsRequired().HasMaxLength(200);
            modelBuilder.Entity<Territory>().Property(t => t.Country).HasMaxLength(100);

            modelBuilder.Entity<Coverage>().ToTable("Coverages");
            modelBuilder.Entity<Coverage>().HasKey(c => c.Id);
            modelBuilder.Entity<Coverage>().Property(c => c.Code).IsRequired().HasMaxLength(20);
            modelBuilder.Entity<Coverage>().Property(c => c.Name).IsRequired().HasMaxLength(200);
            modelBuilder.Entity<Coverage>().Property(c => c.Description).HasMaxLength(1000);

            // ---------------------------------------------------------------
            // Insured / Contact
            // ---------------------------------------------------------------
            modelBuilder.Entity<Insured>().ToTable("Insureds");
            modelBuilder.Entity<Insured>().HasKey(i => i.Id);
            modelBuilder.Entity<Insured>().Property(i => i.Name).IsRequired().HasMaxLength(200);
            modelBuilder.Entity<Insured>().Property(i => i.Address).HasMaxLength(500);
            modelBuilder.Entity<Insured>().Property(i => i.City).HasMaxLength(150);
            modelBuilder.Entity<Insured>().Property(i => i.PostCode).HasMaxLength(20);
            modelBuilder.Entity<Insured>().Property(i => i.RegistrationNumber).HasMaxLength(50);
            modelBuilder.Entity<Insured>().Property(i => i.ExternalId).HasMaxLength(80);
            modelBuilder.Entity<Insured>().HasIndex(i => i.ExternalId).IsUnique().HasFilter("[ExternalId] IS NOT NULL");
            // Not present in database/01_CreateSchema.sql — keep on entity for future use.
            modelBuilder.Entity<Insured>().Ignore(i => i.YearsTrading);
            modelBuilder.Entity<Insured>()
                .HasOne(i => i.Trade)
                .WithMany(t => t.Insureds)
                .HasForeignKey(i => i.TradeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Contact>().ToTable("Contacts");
            modelBuilder.Entity<Contact>().HasKey(c => c.Id);
            modelBuilder.Entity<Contact>().Property(c => c.Name).IsRequired().HasMaxLength(200);
            modelBuilder.Entity<Contact>().Property(c => c.Email).HasMaxLength(200);
            modelBuilder.Entity<Contact>().Property(c => c.Phone).HasMaxLength(50);
            modelBuilder.Entity<Contact>().Property(c => c.JobTitle).HasMaxLength(150);
            modelBuilder.Entity<Contact>()
                .HasOne(c => c.Insured)
                .WithMany(i => i.Contacts)
                .HasForeignKey(c => c.InsuredId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Contact>()
                .HasOne(c => c.Broker)
                .WithMany(b => b.Contacts)
                .HasForeignKey(c => c.BrokerId)
                .OnDelete(DeleteBehavior.Restrict);

            // ---------------------------------------------------------------
            // Submission
            // ---------------------------------------------------------------
            modelBuilder.Entity<Submission>().ToTable("Submissions");
            modelBuilder.Entity<Submission>().HasKey(s => s.Id);
            modelBuilder.Entity<Submission>().Property(s => s.SubmissionNumber).IsRequired().HasMaxLength(30);
            modelBuilder.Entity<Submission>().Property(s => s.TargetPremium).HasPrecision(18, 2);
            modelBuilder.Entity<Submission>().Property(s => s.Notes).HasMaxLength(2000);
            modelBuilder.Entity<Submission>().HasIndex(s => s.SubmissionNumber).IsUnique();
            modelBuilder.Entity<Submission>()
                .HasOne(s => s.Broker)
                .WithMany(b => b.Submissions)
                .HasForeignKey(s => s.BrokerId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Submission>()
                .HasOne(s => s.Insured)
                .WithMany(i => i.Submissions)
                .HasForeignKey(s => s.InsuredId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Submission>()
                .HasOne(s => s.Underwriter)
                .WithMany(u => u.AssignedSubmissions)
                .HasForeignKey(s => s.UnderwriterUserId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Submission>()
                .HasOne(s => s.RenewedFromPolicy)
                .WithMany()
                .HasForeignKey(s => s.RenewedFromPolicyId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Submission>()
                .HasOne(s => s.MarketDetail)
                .WithOne(m => m.Submission)
                .HasForeignKey<RiskMarketDetail>(m => m.SubmissionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RiskMarketDetail>().ToTable("RiskMarketDetails");
            modelBuilder.Entity<RiskMarketDetail>().HasKey(m => m.SubmissionId);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.UwReference).HasMaxLength(40);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.Umr).HasMaxLength(40);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.BrokerReference).HasMaxLength(80);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.BrokerContact).HasMaxLength(200);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.Mop).HasMaxLength(40);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.PolicyType).HasMaxLength(40);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.PolicyDescription).HasMaxLength(1000);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.RiskAppetite).HasMaxLength(40);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.BusinessArea).HasMaxLength(40);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.StatCode1).HasMaxLength(20);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.StatCode2).HasMaxLength(20);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.SubStat1).HasMaxLength(40);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.NewOrRenewal).HasMaxLength(10);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.Reinsured).HasMaxLength(200);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.Domicile).HasMaxLength(80);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.SlipLeader).HasMaxLength(120);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.Syndicate).HasMaxLength(20);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.RiskCode).HasMaxLength(20);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.EsgStatus).HasMaxLength(40);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.NotesType).HasMaxLength(20);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.WrittenLine).HasPrecision(9, 4);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.SignedLine).HasPrecision(9, 4);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.EstSigning).HasPrecision(9, 4);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.ActSigning).HasPrecision(9, 4);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.BrokerOrder).HasPrecision(9, 4);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.NetSharePremium).HasPrecision(18, 2);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.ExpectedPremium).HasPrecision(18, 2);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.WeightedTi).HasPrecision(18, 4);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.WeightedRrm).HasPrecision(18, 4);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.LongTermLossRatio).HasPrecision(9, 4);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.RateAdequacy).HasPrecision(9, 4);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.TechnicalIndex).HasPrecision(18, 4);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.PrincipalUw).HasMaxLength(120);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.SubStat2).HasMaxLength(40);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.EtradingPlatform).HasMaxLength(80);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.LicSecondee).HasMaxLength(120);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.DedXs).HasPrecision(18, 2);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.PremRate).HasPrecision(18, 6);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.RiskChange).HasPrecision(18, 4);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.TcChange).HasPrecision(18, 4);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.OtherChange).HasPrecision(18, 4);
            modelBuilder.Entity<RiskMarketDetail>().Property(m => m.ModelledLr).HasPrecision(18, 4);

            modelBuilder.Entity<IntegrationActivity>().ToTable("IntegrationActivity");
            modelBuilder.Entity<IntegrationActivity>().HasKey(a => a.Id);
            modelBuilder.Entity<IntegrationActivity>().Property(a => a.SystemName).IsRequired().HasMaxLength(40);
            modelBuilder.Entity<IntegrationActivity>().Property(a => a.Direction).IsRequired().HasMaxLength(20);
            modelBuilder.Entity<IntegrationActivity>().Property(a => a.ActionName).IsRequired().HasMaxLength(80);
            modelBuilder.Entity<IntegrationActivity>().Property(a => a.Reference).HasMaxLength(80);
            modelBuilder.Entity<IntegrationActivity>().Property(a => a.Status).IsRequired().HasMaxLength(20);
            modelBuilder.Entity<IntegrationActivity>().Property(a => a.Message).HasMaxLength(1000);

            modelBuilder.Entity<ScheduledJob>().ToTable("ScheduledJobs");
            modelBuilder.Entity<ScheduledJob>().HasKey(j => j.Id);
            modelBuilder.Entity<ScheduledJob>().Property(j => j.JobName).IsRequired().HasMaxLength(120);
            modelBuilder.Entity<ScheduledJob>().Property(j => j.ScheduleType).IsRequired().HasMaxLength(80);
            modelBuilder.Entity<ScheduledJob>().Property(j => j.RagStatus).IsRequired().HasMaxLength(20);
            modelBuilder.Entity<ScheduledJob>().Property(j => j.JobStatus).IsRequired().HasMaxLength(40);

            modelBuilder.Entity<RiskAnswer>().ToTable("RiskAnswers");
            modelBuilder.Entity<RiskAnswer>().HasKey(r => r.Id);
            modelBuilder.Entity<RiskAnswer>().Property(r => r.QuestionCode).IsRequired().HasMaxLength(50);
            modelBuilder.Entity<RiskAnswer>().Property(r => r.QuestionText).HasMaxLength(1000);
            modelBuilder.Entity<RiskAnswer>().Property(r => r.AnswerText).HasMaxLength(2000);
            modelBuilder.Entity<RiskAnswer>().Property(r => r.AnswerNumeric).HasPrecision(18, 2);
            modelBuilder.Entity<RiskAnswer>().Ignore(r => r.AnswerBool);
            modelBuilder.Entity<RiskAnswer>()
                .HasOne(r => r.Submission)
                .WithMany(s => s.RiskAnswers)
                .HasForeignKey(r => r.SubmissionId)
                .OnDelete(DeleteBehavior.Cascade);

            // ---------------------------------------------------------------
            // Quote
            // ---------------------------------------------------------------
            modelBuilder.Entity<Quote>().ToTable("Quotes");
            modelBuilder.Entity<Quote>().HasKey(q => q.Id);
            modelBuilder.Entity<Quote>().Property(q => q.QuoteNumber).IsRequired().HasMaxLength(30);
            modelBuilder.Entity<Quote>().Property(q => q.SumInsured).HasPrecision(18, 2);
            modelBuilder.Entity<Quote>().Property(q => q.LimitOfIndemnity).HasPrecision(18, 2);
            modelBuilder.Entity<Quote>().Property(q => q.Deductible).HasPrecision(18, 2);
            modelBuilder.Entity<Quote>().Property(q => q.GrossPremium).HasPrecision(18, 2);
            modelBuilder.Entity<Quote>().Property(q => q.NetPremium).HasPrecision(18, 2);
            modelBuilder.Entity<Quote>().Property(q => q.CommissionPercent).HasPrecision(9, 4);
            modelBuilder.Entity<Quote>().Property(q => q.CommissionAmount).HasPrecision(18, 2);
            modelBuilder.Entity<Quote>().Property(q => q.ReferralReason).HasMaxLength(500);
            modelBuilder.Entity<Quote>().Property(q => q.ReferralComments).HasMaxLength(2000);
            modelBuilder.Entity<Quote>().Property(q => q.RatingBreakdownJson).HasColumnType("nvarchar(max)");
            modelBuilder.Entity<Quote>()
                .HasOne(q => q.Submission)
                .WithMany(s => s.Quotes)
                .HasForeignKey(q => q.SubmissionId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Quote>()
                .HasOne(q => q.ReferralDecisionByUser)
                .WithMany()
                .HasForeignKey(q => q.ReferralDecisionByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // ---------------------------------------------------------------
            // Policy / Endorsement
            // ---------------------------------------------------------------
            modelBuilder.Entity<Policy>().ToTable("Policies");
            modelBuilder.Entity<Policy>().HasKey(p => p.Id);
            modelBuilder.Entity<Policy>().Property(p => p.PolicyNumber).IsRequired().HasMaxLength(30);
            modelBuilder.Entity<Policy>().Property(p => p.GrossPremium).HasPrecision(18, 2);
            modelBuilder.Entity<Policy>().Property(p => p.NetPremium).HasPrecision(18, 2);
            modelBuilder.Entity<Policy>().Property(p => p.SumInsured).HasPrecision(18, 2);
            modelBuilder.Entity<Policy>().Property(p => p.LimitOfIndemnity).HasPrecision(18, 2);
            modelBuilder.Entity<Policy>().Property(p => p.Deductible).HasPrecision(18, 2);
            modelBuilder.Entity<Policy>().Property(p => p.CancellationReason).HasMaxLength(1000);
            // Schema column is CancellationDate (see database/01_CreateSchema.sql).
            modelBuilder.Entity<Policy>().Property(p => p.CancelledDate).HasColumnName("CancellationDate");
            modelBuilder.Entity<Policy>().HasIndex(p => p.PolicyNumber).IsUnique();
            modelBuilder.Entity<Policy>()
                .HasOne(p => p.Quote)
                .WithMany()
                .HasForeignKey(p => p.QuoteId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Policy>()
                .HasOne(p => p.Submission)
                .WithMany()
                .HasForeignKey(p => p.SubmissionId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Policy>()
                .HasOne(p => p.Broker)
                .WithMany(b => b.Policies)
                .HasForeignKey(p => p.BrokerId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Policy>()
                .HasOne(p => p.Insured)
                .WithMany(i => i.Policies)
                .HasForeignKey(p => p.InsuredId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Policy>()
                .HasOne(p => p.RenewedFromPolicy)
                .WithMany()
                .HasForeignKey(p => p.RenewedFromPolicyId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Endorsement>().ToTable("Endorsements");
            modelBuilder.Entity<Endorsement>().HasKey(e => e.Id);
            modelBuilder.Entity<Endorsement>().Property(e => e.EndorsementNumber).IsRequired().HasMaxLength(30);
            modelBuilder.Entity<Endorsement>().Property(e => e.Description).HasMaxLength(1000);
            modelBuilder.Entity<Endorsement>().Property(e => e.PremiumChange).HasPrecision(18, 2);
            modelBuilder.Entity<Endorsement>().Property(e => e.Status).HasMaxLength(30);
            modelBuilder.Entity<Endorsement>()
                .HasOne(e => e.Policy)
                .WithMany(p => p.Endorsements)
                .HasForeignKey(e => e.PolicyId)
                .OnDelete(DeleteBehavior.Cascade);

            // ---------------------------------------------------------------
            // Claim
            // ---------------------------------------------------------------
            modelBuilder.Entity<Claim>().ToTable("Claims");
            modelBuilder.Entity<Claim>().HasKey(c => c.Id);
            modelBuilder.Entity<Claim>().Property(c => c.ClaimNumber).IsRequired().HasMaxLength(30);
            modelBuilder.Entity<Claim>().Property(c => c.Description).HasMaxLength(2000);
            modelBuilder.Entity<Claim>().Property(c => c.ReserveAmount).HasPrecision(18, 2);
            modelBuilder.Entity<Claim>().Property(c => c.PaidAmount).HasPrecision(18, 2);
            // Schema: LossDate / NotifiedDate (see database/01_CreateSchema.sql).
            modelBuilder.Entity<Claim>().Property(c => c.DateOfLoss).HasColumnName("LossDate");
            modelBuilder.Entity<Claim>().Property(c => c.DateReported).HasColumnName("NotifiedDate");
            modelBuilder.Entity<Claim>().Ignore(c => c.ClosedDate);
            modelBuilder.Entity<Claim>().Ignore(c => c.CreatedDate);
            modelBuilder.Entity<Claim>().HasIndex(c => c.ClaimNumber).IsUnique();
            modelBuilder.Entity<Claim>()
                .HasOne(c => c.Policy)
                .WithMany(p => p.Claims)
                .HasForeignKey(c => c.PolicyId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Claim>()
                .HasOne(c => c.Insured)
                .WithMany(i => i.Claims)
                .HasForeignKey(c => c.InsuredId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Claim>()
                .HasOne(c => c.Broker)
                .WithMany(b => b.Claims)
                .HasForeignKey(c => c.BrokerId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Claim>()
                .HasOne(c => c.Handler)
                .WithMany(u => u.HandledClaims)
                .HasForeignKey(c => c.HandlerUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // ---------------------------------------------------------------
            // Document / DocumentAccessLog
            // ---------------------------------------------------------------
            modelBuilder.Entity<Document>().ToTable("Documents");
            modelBuilder.Entity<Document>().HasKey(d => d.Id);
            modelBuilder.Entity<Document>().Property(d => d.FileName).IsRequired().HasMaxLength(260);
            modelBuilder.Entity<Document>().Property(d => d.StoredFileName).IsRequired().HasMaxLength(260);
            modelBuilder.Entity<Document>().Property(d => d.StoragePath).HasMaxLength(500);
            modelBuilder.Entity<Document>().Property(d => d.ContentType).HasMaxLength(150);
            modelBuilder.Entity<Document>().Property(d => d.Notes).HasMaxLength(2000);
            modelBuilder.Entity<Document>()
                .HasOne(d => d.Submission)
                .WithMany(s => s.Documents)
                .HasForeignKey(d => d.SubmissionId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Document>()
                .HasOne(d => d.Policy)
                .WithMany(p => p.Documents)
                .HasForeignKey(d => d.PolicyId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Document>()
                .HasOne(d => d.Claim)
                .WithMany()
                .HasForeignKey(d => d.ClaimId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Document>()
                .HasOne(d => d.ParentDocument)
                .WithMany()
                .HasForeignKey(d => d.ParentDocumentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<DocumentAccessLog>().ToTable("DocumentAccessLogs");
            modelBuilder.Entity<DocumentAccessLog>().HasKey(d => d.Id);
            // Schema uses AccessedAt (see database/01_CreateSchema.sql).
            modelBuilder.Entity<DocumentAccessLog>().Property(d => d.AccessDate).HasColumnName("AccessedAt");
            modelBuilder.Entity<DocumentAccessLog>().Property(d => d.AccessType).IsRequired().HasMaxLength(30);
            modelBuilder.Entity<DocumentAccessLog>()
                .HasOne(d => d.Document)
                .WithMany()
                .HasForeignKey(d => d.DocumentId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<DocumentAccessLog>()
                .HasOne(d => d.User)
                .WithMany()
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // ---------------------------------------------------------------
            // AuthorityRule
            // ---------------------------------------------------------------
            modelBuilder.Entity<AuthorityRule>().ToTable("AuthorityRules");
            modelBuilder.Entity<AuthorityRule>().HasKey(a => a.Id);
            modelBuilder.Entity<AuthorityRule>().Property(a => a.MaxPremium).HasPrecision(18, 2);
            modelBuilder.Entity<AuthorityRule>().Property(a => a.MaxSumInsured).HasPrecision(18, 2);
            modelBuilder.Entity<AuthorityRule>().Property(a => a.MaxLimit).HasPrecision(18, 2);

            // ---------------------------------------------------------------
            // AuditLog / LoginAudit
            // ---------------------------------------------------------------
            modelBuilder.Entity<AuditLog>().ToTable("AuditLogs");
            modelBuilder.Entity<AuditLog>().HasKey(a => a.Id);
            modelBuilder.Entity<AuditLog>().Property(a => a.EntityName).IsRequired().HasMaxLength(100);
            modelBuilder.Entity<AuditLog>().Property(a => a.Action).IsRequired().HasMaxLength(100);
            modelBuilder.Entity<AuditLog>().Property(a => a.OldValue).HasColumnType("nvarchar(max)");
            modelBuilder.Entity<AuditLog>().Property(a => a.NewValue).HasColumnType("nvarchar(max)");
            modelBuilder.Entity<AuditLog>().Property(a => a.Details).HasColumnType("nvarchar(max)");
            modelBuilder.Entity<AuditLog>()
                .HasOne(a => a.User)
                .WithMany()
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<LoginAudit>().ToTable("LoginAudits");
            modelBuilder.Entity<LoginAudit>().HasKey(l => l.Id);
            modelBuilder.Entity<LoginAudit>().Property(l => l.Username).IsRequired().HasMaxLength(100);
            // Schema uses Success / Timestamp (see database/01_CreateSchema.sql).
            modelBuilder.Entity<LoginAudit>().Property(l => l.WasSuccessful).HasColumnName("Success");
            modelBuilder.Entity<LoginAudit>().Property(l => l.LoginDate).HasColumnName("Timestamp");
            modelBuilder.Entity<LoginAudit>().Property(l => l.IpAddress).HasMaxLength(50);
            modelBuilder.Entity<LoginAudit>().Property(l => l.FailureReason).HasMaxLength(500);
            modelBuilder.Entity<LoginAudit>()
                .HasOne(l => l.User)
                .WithMany()
                .HasForeignKey(l => l.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // ---------------------------------------------------------------
            // WorkflowTask / Notification
            // ---------------------------------------------------------------
            modelBuilder.Entity<WorkflowTask>().ToTable("WorkflowTasks");
            modelBuilder.Entity<WorkflowTask>().HasKey(w => w.Id);
            modelBuilder.Entity<WorkflowTask>().Property(w => w.Title).IsRequired().HasMaxLength(200);
            modelBuilder.Entity<WorkflowTask>().Property(w => w.Description).HasMaxLength(2000);
            modelBuilder.Entity<WorkflowTask>().Property(w => w.Priority).HasMaxLength(20);
            modelBuilder.Entity<WorkflowTask>().Property(w => w.TaskType).HasMaxLength(40);
            modelBuilder.Entity<WorkflowTask>().Property(w => w.Reference).HasMaxLength(80);
            modelBuilder.Entity<WorkflowTask>().Property(w => w.LloydsPin).HasMaxLength(40);
            modelBuilder.Entity<WorkflowTask>()
                .HasOne(w => w.Submission)
                .WithMany(s => s.Tasks)
                .HasForeignKey(w => w.SubmissionId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<WorkflowTask>()
                .HasOne(w => w.Claim)
                .WithMany()
                .HasForeignKey(w => w.ClaimId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<WorkflowTask>()
                .HasOne(w => w.AssignedTo)
                .WithMany(u => u.AssignedTasks)
                .HasForeignKey(w => w.AssignedToUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TaskComment>().ToTable("TaskComments");
            modelBuilder.Entity<TaskComment>().HasKey(c => c.Id);
            modelBuilder.Entity<TaskComment>().Property(c => c.Body).IsRequired().HasMaxLength(2000);
            modelBuilder.Entity<TaskComment>()
                .HasOne(c => c.Task)
                .WithMany()
                .HasForeignKey(c => c.TaskId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Notification>().ToTable("Notifications");
            modelBuilder.Entity<Notification>().HasKey(n => n.Id);
            modelBuilder.Entity<Notification>().Property(n => n.Title).IsRequired().HasMaxLength(200);
            modelBuilder.Entity<Notification>().Property(n => n.Message).IsRequired().HasMaxLength(2000);
            modelBuilder.Entity<Notification>().Property(n => n.LinkUrl).HasMaxLength(500);
            modelBuilder.Entity<Notification>().Property(n => n.RelatedEntityType).HasMaxLength(100);
            modelBuilder.Entity<Notification>()
                .HasOne(n => n.User)
                .WithMany(u => u.Notifications)
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // ---------------------------------------------------------------
            // RateTable / ReferralRule
            // ---------------------------------------------------------------
            modelBuilder.Entity<RateTable>().ToTable("RateTables");
            modelBuilder.Entity<RateTable>().HasKey(r => r.Id);
            modelBuilder.Entity<RateTable>().Property(r => r.BaseRatePer1000).HasPrecision(18, 4);
            modelBuilder.Entity<RateTable>().Property(r => r.MinPremium).HasPrecision(18, 2);
            modelBuilder.Entity<RateTable>()
                .HasOne(r => r.Trade)
                .WithMany(t => t.RateTables)
                .HasForeignKey(r => r.TradeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ReferralRule>().ToTable("ReferralRules");
            modelBuilder.Entity<ReferralRule>().HasKey(r => r.Id);
            modelBuilder.Entity<ReferralRule>().Property(r => r.MinSumInsured).HasPrecision(18, 2);
            modelBuilder.Entity<ReferralRule>().Property(r => r.MaxSumInsured).HasPrecision(18, 2);
            modelBuilder.Entity<ReferralRule>().Property(r => r.MinLimit).HasPrecision(18, 2);
            modelBuilder.Entity<ReferralRule>().Property(r => r.MaxLimit).HasPrecision(18, 2);
            modelBuilder.Entity<ReferralRule>().Property(r => r.TriggersOnRestrictedTrade).HasDefaultValue(false);
            modelBuilder.Entity<ReferralRule>().Property(r => r.Reason).IsRequired().HasMaxLength(500);
            modelBuilder.Entity<ReferralRule>()
                .HasOne(r => r.Trade)
                .WithMany(t => t.ReferralRules)
                .HasForeignKey(r => r.TradeId)
                .OnDelete(DeleteBehavior.Restrict);

            // ---------------------------------------------------------------
            // SystemParameter / HolidayCalendar
            // ---------------------------------------------------------------
            modelBuilder.Entity<SystemParameter>().ToTable("SystemParameters");
            modelBuilder.Entity<SystemParameter>().HasKey(s => s.Id);
            modelBuilder.Entity<SystemParameter>().Property(s => s.Key).IsRequired().HasMaxLength(100);
            modelBuilder.Entity<SystemParameter>().Property(s => s.Value).IsRequired().HasMaxLength(1000);
            modelBuilder.Entity<SystemParameter>().Property(s => s.Description).HasMaxLength(500);
            modelBuilder.Entity<SystemParameter>().Property(s => s.DataType).HasMaxLength(30);
            modelBuilder.Entity<SystemParameter>().HasIndex(s => s.Key).IsUnique();

            modelBuilder.Entity<HolidayCalendar>().ToTable("HolidayCalendars");
            modelBuilder.Entity<HolidayCalendar>().HasKey(h => h.Id);
            modelBuilder.Entity<HolidayCalendar>().Property(h => h.Description).HasMaxLength(200);
            modelBuilder.Entity<HolidayCalendar>().Property(h => h.CountryCode).HasMaxLength(10);
        }
    }
}
