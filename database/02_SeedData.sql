/* Apex Insurance — seed data. Demo password for all users: Password1! (empty hash triggers demo fallback) */
USE ApexInsurance;
GO

DELETE FROM dbo.DocumentAccessLogs;
DELETE FROM dbo.LoginAudits;
DELETE FROM dbo.AuditLogs;
DELETE FROM dbo.Notifications;
DELETE FROM dbo.WorkflowTasks;
DELETE FROM dbo.Documents;
DELETE FROM dbo.Claims;
DELETE FROM dbo.Endorsements;
DELETE FROM dbo.Policies;
DELETE FROM dbo.Quotes;
DELETE FROM dbo.RiskAnswers;
DELETE FROM dbo.Submissions;
DELETE FROM dbo.Contacts;
DELETE FROM dbo.ReferralRules;
DELETE FROM dbo.AuthorityRules;
DELETE FROM dbo.RateTables;
DELETE FROM dbo.HolidayCalendars;
DELETE FROM dbo.SystemParameters;
DELETE FROM dbo.Coverages;
DELETE FROM dbo.Territories;
DELETE FROM dbo.Insureds;
DELETE FROM dbo.Trades;
DELETE FROM dbo.Brokers;
DELETE FROM dbo.Users;
DELETE FROM dbo.Teams;
GO

SET IDENTITY_INSERT dbo.Teams ON;
INSERT INTO dbo.Teams (Id, Name, Description, PremiumTargetYtd) VALUES
 (1, N'Commercial SME', N'Property / Liability / PI underwriting', 5000000.00),
 (2, N'Claims', N'Claims handling desk', 0);
SET IDENTITY_INSERT dbo.Teams OFF;

-- Roles: Underwriter=0, UnderwritingManager=1, BrokerOps=2, ClaimsHandler=3, Admin=4
SET IDENTITY_INSERT dbo.Users ON;
INSERT INTO dbo.Users (Id, Username, Email, FullName, PasswordHash, PasswordSalt, Role, TeamId, AuthorityLimit, IsActive, CreatedDate) VALUES
 (1, N'admin', N'admin@apex.local', N'System Admin', NULL, NULL, 4, 1, 999999999, 1, SYSUTCDATETIME()),
 (2, N'uw1', N'uw1@apex.local', N'Uma Underwriter', NULL, NULL, 0, 1, 250000, 1, SYSUTCDATETIME()),
 (3, N'mgr1', N'mgr1@apex.local', N'Morgan Manager', NULL, NULL, 1, 1, 2000000, 1, SYSUTCDATETIME()),
 (4, N'cl1', N'cl1@apex.local', N'Casey Claims', NULL, NULL, 3, 2, 0, 1, SYSUTCDATETIME()),
 (5, N'bro1', N'bro1@apex.local', N'Blair Broker Ops', NULL, NULL, 2, 1, 0, 1, SYSUTCDATETIME());
SET IDENTITY_INSERT dbo.Users OFF;

UPDATE dbo.Teams SET ManagerUserId = 3 WHERE Id = 1;

SET IDENTITY_INSERT dbo.Brokers ON;
INSERT INTO dbo.Brokers (Id, Name, BrokerCode, ContactEmail, ContactPhone, Address, AgreementRef, IsActive, ProductionTarget) VALUES
 (1, N'Northbridge Brokers', N'NB01', N'team@northbridge.example', N'020 7946 0001', N'1 Market St, London', N'AGR-NB-2024', 1, 1500000),
 (2, N'Harbour & Co', N'HC02', N'desk@harbour.example', N'0161 555 0102', N'12 Quay Rd, Manchester', N'AGR-HC-2024', 1, 900000),
 (3, N'Summit Specialty', N'SS03', N'ops@summit.example', N'0113 555 0199', N'8 Peak Ave, Leeds', N'AGR-SS-2023', 1, 750000);
SET IDENTITY_INSERT dbo.Brokers OFF;

SET IDENTITY_INSERT dbo.Trades ON;
INSERT INTO dbo.Trades (Id, Code, Name, RiskCategory, LoadingPercent, IsRestricted, IsActive) VALUES
 (1, N'OFFICE', N'Office / Professional Services', N'Standard', 0, 0, 1),
 (2, N'RETAIL', N'Retail Shop', N'Standard', 5, 0, 1),
 (3, N'WASTE', N'Waste Management', N'High', 25, 1, 1),
 (4, N'ITCON', N'IT Consultancy', N'Standard', 0, 0, 1);
SET IDENTITY_INSERT dbo.Trades OFF;

INSERT INTO dbo.Territories (Code, Name, Country, IsActive) VALUES
 (N'LON', N'London', N'UK', 1),
 (N'NW', N'North West', N'UK', 1),
 (N'YH', N'Yorkshire', N'UK', 1);

-- LOB: Property=0, Liability=1, ProfessionalIndemnity=2
INSERT INTO dbo.Coverages (Code, Name, Description, LineOfBusiness, DefaultLimit, IsActive) VALUES
 (N'BLDG', N'Buildings', N'Material damage - buildings', 0, 1000000, 1),
 (N'PL', N'Public Liability', N'Third party liability', 1, 2000000, 1),
 (N'PI', N'Professional Indemnity', N'Negligent advice / design', 2, 1000000, 1);

SET IDENTITY_INSERT dbo.Insureds ON;
INSERT INTO dbo.Insureds (Id, Name, TradingName, Address, City, PostCode, RegistrationNumber, TradeId, Occupancy) VALUES
 (1, N'Acme Office Ltd', N'Acme', N'10 High St', N'London', N'EC1A 1BB', N'11111111', 1, N'Office'),
 (2, N'Riverside Retail Ltd', N'Riverside', N'22 Canal Rd', N'Manchester', N'M1 2AB', N'22222222', 2, N'Retail'),
 (3, N'Peak Waste Services', N'Peak Waste', N'5 Tip Lane', N'Leeds', N'LS1 4XY', N'33333333', 3, N'Waste'),
 (4, N'ByteCraft Consulting', N'ByteCraft', N'9 Code Close', N'London', N'W1A 2BC', N'44444444', 4, N'IT'),
 (5, N'Greenleaf Gardens Ltd', N'Greenleaf', N'3 Orchard Way', N'Manchester', N'M20 3CD', N'55555555', 1, N'Office');
SET IDENTITY_INSERT dbo.Insureds OFF;

INSERT INTO dbo.RateTables (LineOfBusiness, TradeId, BaseRatePer1000, MinPremium, EffectiveDate, IsActive) VALUES
 (0, NULL, 1.25, 350, '2024-01-01', 1),
 (0, 3, 2.50, 750, '2024-01-01', 1),
 (1, NULL, 0.85, 400, '2024-01-01', 1),
 (2, NULL, 1.10, 500, '2024-01-01', 1),
 (2, 4, 0.95, 450, '2024-01-01', 1);

INSERT INTO dbo.ReferralRules (LineOfBusiness, TradeId, MaxSumInsured, MaxLimit, TriggersOnRestrictedTrade, Reason, IsActive) VALUES
 (0, NULL, 5000000, NULL, 0, N'Sum insured exceeds £5m', 1),
 (1, NULL, NULL, 5000000, 0, N'Limit of indemnity exceeds £5m', 1),
 (0, 3, NULL, NULL, 1, N'Restricted trade - waste management', 1);

    INSERT INTO dbo.AuthorityRules (Role, LineOfBusiness, MaxPremium, MaxSumInsured, MaxLimit, IsActive) VALUES
 (0, 0, 50000, 2000000, 2000000, 1),
 (0, 1, 40000, 2000000, 2000000, 1),
 (0, 2, 45000, 1500000, 1500000, 1),
 (1, 0, 250000, 10000000, 10000000, 1),
 (1, 1, 250000, 10000000, 10000000, 1),
 (1, 2, 250000, 10000000, 10000000, 1);

    INSERT INTO dbo.SystemParameters ([Key], Value, Description, DataType) VALUES
 (N'RenewalHorizonDays', N'90', N'Days ahead for renewal diary', N'int'),
 (N'DocumentStoragePath', N'App_Data\\Documents', N'Relative document root', N'string'),
 (N'DefaultCommissionPercent', N'15', N'Default broker commission %', N'decimal');

    INSERT INTO dbo.HolidayCalendars (HolidayDate, Description, CountryCode) VALUES
 ('2026-01-01', N'New Year''s Day', N'GB'),
 ('2026-12-25', N'Christmas Day', N'GB'),
 ('2026-12-28', N'Boxing Day (observed)', N'GB');

-- Status: Received=0, Triaged=1, Quoted=2, Referred=3, Bound=4, Declined=5, NotTakenUp=6
SET IDENTITY_INSERT dbo.Submissions ON;
INSERT INTO dbo.Submissions (Id, SubmissionNumber, BrokerId, InsuredId, UnderwriterUserId, LineOfBusiness, Status, TargetPremium, RequestedEffectiveDate, ReceivedDate, CreatedDate, AssignedDate, DueDate, Notes) VALUES
 (1, N'SUB-2026-00001', 1, 1, 2, 0, 2, 12000, '2026-09-01', '2026-08-01', '2026-08-01', '2026-08-01', DATEADD(DAY, 7, SYSUTCDATETIME()), N'Office property renewal'),
 (2, N'SUB-2026-00002', 2, 2, 2, 1, 0, 8000, '2026-09-15', '2026-08-02', '2026-08-02', NULL, DATEADD(DAY, 5, SYSUTCDATETIME()), N'New retail PL'),
 (3, N'SUB-2026-00003', 3, 3, 2, 0, 3, 45000, '2026-10-01', '2026-08-03', '2026-08-03', '2026-08-03', DATEADD(DAY, -1, SYSUTCDATETIME()), N'Referred - waste trade'),
 (4, N'SUB-2026-00004', 1, 4, 2, 2, 4, 15000, '2026-07-01', '2026-06-15', '2026-06-15', '2026-06-15', NULL, N'PI bound'),
 (5, N'SUB-2026-00005', 2, 5, NULL, 0, 0, 6000, '2026-11-01', '2026-08-04', '2026-08-04', NULL, DATEADD(DAY, 10, SYSUTCDATETIME()), N'Unassigned new intake'),
 (6, N'SUB-2026-00006', 1, 1, 2, 1, 5, 9000, '2026-08-20', '2026-07-10', '2026-07-10', '2026-07-10', NULL, N'Declined - appetite'),
 (7, N'SUB-2026-00007', 3, 2, 2, 0, 6, 11000, '2026-08-01', '2026-07-01', '2026-07-01', '2026-07-01', NULL, N'NTU - client placed elsewhere'),
 (8, N'SUB-2026-00008', 2, 4, 2, 2, 1, 18000, '2026-10-15', '2026-08-05', '2026-08-05', '2026-08-05', DATEADD(DAY, 3, SYSUTCDATETIME()), N'Triaged PI lead');
SET IDENTITY_INSERT dbo.Submissions OFF;

INSERT INTO dbo.RiskAnswers (SubmissionId, QuestionCode, QuestionText, AnswerText, AnswerNumeric) VALUES
 (1, N'CONSTRUCTION', N'Construction type', N'Brick / tile', NULL),
 (1, N'SUM_BUILDINGS', N'Buildings sum insured', NULL, 1500000),
 (3, N'WASTE_TYPE', N'Type of waste handled', N'General commercial', NULL);

SET IDENTITY_INSERT dbo.Quotes ON;
INSERT INTO dbo.Quotes (Id, QuoteNumber, SubmissionId, VersionNumber, SumInsured, LimitOfIndemnity, Deductible, GrossPremium, NetPremium, CommissionPercent, CommissionAmount, IsReferralRequired, ReferralReason, ReferralDecision, IsSelected, CreatedByUserId, CreatedDate, ExpiryDate) VALUES
 (1, N'Q-2026-00001', 1, 1, 1500000, 1500000, 1000, 11875, 10093.75, 15, 1781.25, 0, NULL, 0, 1, 2, '2026-08-01', '2026-08-31'),
 (2, N'Q-2026-00002', 3, 1, 3000000, 3000000, 5000, 42000, 35700, 15, 6300, 1, N'Restricted trade', 1, 0, 2, '2026-08-03', '2026-09-02'),
 (3, N'Q-2026-00003', 4, 1, 1000000, 1000000, 2500, 14200, 12070, 15, 2130, 0, NULL, 0, 1, 2, '2026-06-16', '2026-07-16');
SET IDENTITY_INSERT dbo.Quotes OFF;

UPDATE dbo.Submissions SET Status = 4 WHERE Id = 4; -- Bound
UPDATE dbo.Submissions SET Status = 2 WHERE Id = 1; -- Quoted

SET IDENTITY_INSERT dbo.Policies ON;
INSERT INTO dbo.Policies (Id, PolicyNumber, QuoteId, SubmissionId, BrokerId, InsuredId, LineOfBusiness, Status, EffectiveDate, ExpiryDate, GrossPremium, NetPremium, SumInsured, LimitOfIndemnity, Deductible, BoundDate, BoundByUserId) VALUES
 (1, N'APEX-2026-00001', 3, 4, 1, 4, 2, 0, '2026-07-01', DATEADD(DAY, 45, SYSUTCDATETIME()), 14200, 12070, 1000000, 1000000, 2500, '2026-06-20', 2);
SET IDENTITY_INSERT dbo.Policies OFF;

INSERT INTO dbo.Claims (ClaimNumber, PolicyId, InsuredId, BrokerId, Status, LossDate, NotifiedDate, Description, ReserveAmount, PaidAmount, HandlerUserId) VALUES
 (N'CLM-2026-00001', 1, 4, 1, 0, '2026-07-20', '2026-07-21', N'Alleged negligent advice claim', 25000, 0, 4);

INSERT INTO dbo.Documents (FileName, StoredFileName, StoragePath, ContentType, DocumentType, FileSizeBytes, VersionNumber, IsLatestVersion, SubmissionId, PolicyId, UploadedByUserId, UploadedDate, Notes) VALUES
 (N'proposal-acme.pdf', N'0001-proposal.pdf', N'App_Data/Documents', N'application/pdf', 0, 24576, 1, 1, 1, NULL, 2, '2026-08-01', N'Proposal form'),
 (N'schedule-pi.pdf', N'0002-schedule.pdf', N'App_Data/Documents', N'application/pdf', 3, 18432, 1, 1, 4, 1, 2, '2026-06-20', N'Policy schedule');

INSERT INTO dbo.WorkflowTasks (Title, Description, Priority, Status, SubmissionId, AssignedToUserId, DueDate, CreatedDate, CompletedDate) VALUES
 (N'Review waste referral', N'Submission SUB-2026-00003 requires manager decision', N'High', 0, 3, 3, DATEADD(DAY, 2, SYSUTCDATETIME()), SYSUTCDATETIME(), NULL),
 (N'Chase SOV for Acme', N'Request updated statement of values', N'Normal', 0, 1, 2, DATEADD(DAY, 1, SYSUTCDATETIME()), SYSUTCDATETIME(), NULL),
 (N'Day file modelling note', N'Modelling pack reviewed for SUB-2026-00008', N'Normal', 2, 8, 2, SYSUTCDATETIME(), DATEADD(HOUR, -2, SYSUTCDATETIME()), DATEADD(HOUR, -1, SYSUTCDATETIME())),
 (N'Query: broker order unclear', N'Ops query for Harbour & Co on SUB-2026-00002', N'High', 0, 2, 2, DATEADD(DAY, -1, SYSUTCDATETIME()), SYSUTCDATETIME(), NULL);

INSERT INTO dbo.Notifications (UserId, Title, Message, IsRead, CreatedDate, RelatedEntityType, RelatedEntityId) VALUES
 (3, N'Referral pending', N'SUB-2026-00003 awaits your decision', 0, SYSUTCDATETIME(), N'Submission', 3),
 (2, N'New assignment', N'SUB-2026-00001 assigned to you', 1, SYSUTCDATETIME(), N'Submission', 1);

PRINT 'Seed complete. Demo password for all: Password1!';
PRINT '  uw1 (Underwriter) | mgr1 (UW Manager) | bro1 (Broker Ops) | cl1 (Claims) | admin (Admin)';
GO
