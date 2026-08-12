/* Apex Insurance — schema matching EF6 ApexInsuranceDbContext (plural tables) */
IF NOT EXISTS (SELECT 1 FROM sys.databases WHERE name = N'ApexInsurance')
BEGIN
    CREATE DATABASE ApexInsurance;
END
GO
USE ApexInsurance;
GO

DECLARE @sql NVARCHAR(MAX) = N'';
SELECT @sql += N'DROP TABLE IF EXISTS ' + QUOTENAME(s.name) + N'.' + QUOTENAME(t.name) + N';'
FROM sys.tables t
JOIN sys.schemas s ON t.schema_id = s.schema_id
WHERE t.name IN (
 N'DocumentAccessLogs',N'LoginAudits',N'AuditLogs',N'Notifications',N'WorkflowTasks',
 N'Documents',N'Claims',N'Endorsements',N'Policies',N'Quotes',N'RiskAnswers',N'Submissions',
 N'Contacts',N'ReferralRules',N'AuthorityRules',N'RateTables',N'HolidayCalendars',
 N'SystemParameters',N'Trades',N'Territories',N'Coverages',N'Insureds',N'Brokers',N'Users',N'Teams'
);
EXEC sp_executesql @sql;
GO

CREATE TABLE dbo.Teams (
  Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  Name NVARCHAR(150) NOT NULL,
  Description NVARCHAR(500) NULL,
  ManagerUserId INT NULL,
  PremiumTargetYtd DECIMAL(18,2) NOT NULL CONSTRAINT DF_Teams_Target DEFAULT(0),
  RowVersion ROWVERSION
);

CREATE TABLE dbo.Users (
  Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  Username NVARCHAR(100) NOT NULL,
  Email NVARCHAR(200) NOT NULL,
  FullName NVARCHAR(200) NOT NULL,
  PasswordHash NVARCHAR(400) NULL,
  PasswordSalt NVARCHAR(400) NULL,
  Role INT NOT NULL,
  TeamId INT NULL,
  AuthorityLimit DECIMAL(18,2) NOT NULL CONSTRAINT DF_Users_Auth DEFAULT(0),
  IsActive BIT NOT NULL CONSTRAINT DF_Users_Active DEFAULT(1),
  LastLoginDate DATETIME2 NULL,
  CreatedDate DATETIME2 NOT NULL CONSTRAINT DF_Users_Created DEFAULT(SYSUTCDATETIME()),
  RowVersion ROWVERSION,
  CONSTRAINT UQ_Users_Username UNIQUE (Username),
  CONSTRAINT FK_Users_Teams FOREIGN KEY (TeamId) REFERENCES dbo.Teams(Id)
);

CREATE TABLE dbo.Brokers (
  Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  Name NVARCHAR(200) NOT NULL,
  BrokerCode NVARCHAR(20) NOT NULL,
  ContactEmail NVARCHAR(200) NULL,
  ContactPhone NVARCHAR(50) NULL,
  Address NVARCHAR(500) NULL,
  AgreementRef NVARCHAR(100) NULL,
  IsActive BIT NOT NULL CONSTRAINT DF_Brokers_Active DEFAULT(1),
  ProductionTarget DECIMAL(18,2) NOT NULL CONSTRAINT DF_Brokers_Target DEFAULT(0),
  RowVersion ROWVERSION,
  CONSTRAINT UQ_Brokers_Code UNIQUE (BrokerCode)
);

CREATE TABLE dbo.Trades (
  Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  Code NVARCHAR(20) NOT NULL,
  Name NVARCHAR(200) NOT NULL,
  RiskCategory NVARCHAR(50) NULL,
  LoadingPercent DECIMAL(9,4) NOT NULL CONSTRAINT DF_Trades_Load DEFAULT(0),
  IsRestricted BIT NOT NULL CONSTRAINT DF_Trades_Rest DEFAULT(0),
  IsActive BIT NOT NULL CONSTRAINT DF_Trades_Active DEFAULT(1),
  RowVersion ROWVERSION
);

CREATE TABLE dbo.Territories (
  Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  Code NVARCHAR(20) NOT NULL,
  Name NVARCHAR(200) NOT NULL,
  Country NVARCHAR(100) NULL,
  IsActive BIT NOT NULL CONSTRAINT DF_Terr_Active DEFAULT(1),
  RowVersion ROWVERSION
);

CREATE TABLE dbo.Coverages (
  Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  Code NVARCHAR(20) NOT NULL,
  Name NVARCHAR(200) NOT NULL,
  Description NVARCHAR(1000) NULL,
  LineOfBusiness INT NOT NULL,
  DefaultLimit DECIMAL(18,2) NULL,
  IsActive BIT NOT NULL CONSTRAINT DF_Cov_Active DEFAULT(1),
  RowVersion ROWVERSION
);

CREATE TABLE dbo.Insureds (
  Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  Name NVARCHAR(200) NOT NULL,
  TradingName NVARCHAR(200) NULL,
  Address NVARCHAR(500) NULL,
  City NVARCHAR(150) NULL,
  PostCode NVARCHAR(20) NULL,
  RegistrationNumber NVARCHAR(50) NULL,
  ExternalId NVARCHAR(80) NULL,
  TradeId INT NULL,
  Occupancy NVARCHAR(200) NULL,
  RowVersion ROWVERSION,
  CONSTRAINT FK_Insureds_Trades FOREIGN KEY (TradeId) REFERENCES dbo.Trades(Id)
);
CREATE UNIQUE INDEX UX_Insureds_ExternalId ON dbo.Insureds(ExternalId) WHERE ExternalId IS NOT NULL;

CREATE TABLE dbo.Contacts (
  Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  Name NVARCHAR(200) NOT NULL,
  Email NVARCHAR(200) NULL,
  Phone NVARCHAR(50) NULL,
  JobTitle NVARCHAR(150) NULL,
  InsuredId INT NULL,
  BrokerId INT NULL,
  RowVersion ROWVERSION,
  CONSTRAINT FK_Contacts_Insureds FOREIGN KEY (InsuredId) REFERENCES dbo.Insureds(Id),
  CONSTRAINT FK_Contacts_Brokers FOREIGN KEY (BrokerId) REFERENCES dbo.Brokers(Id)
);

CREATE TABLE dbo.Submissions (
  Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  SubmissionNumber NVARCHAR(30) NOT NULL,
  BrokerId INT NOT NULL,
  InsuredId INT NOT NULL,
  UnderwriterUserId INT NULL,
  LineOfBusiness INT NOT NULL,
  Status INT NOT NULL,
  TargetPremium DECIMAL(18,2) NULL,
  RequestedEffectiveDate DATETIME2 NOT NULL,
  ReceivedDate DATETIME2 NOT NULL,
  CreatedDate DATETIME2 NOT NULL,
  AssignedDate DATETIME2 NULL,
  DueDate DATETIME2 NULL,
  RenewedFromPolicyId INT NULL,
  Notes NVARCHAR(2000) NULL,
  RowVersion ROWVERSION,
  CONSTRAINT UQ_Submissions_Number UNIQUE (SubmissionNumber),
  CONSTRAINT FK_Submissions_Brokers FOREIGN KEY (BrokerId) REFERENCES dbo.Brokers(Id),
  CONSTRAINT FK_Submissions_Insureds FOREIGN KEY (InsuredId) REFERENCES dbo.Insureds(Id),
  CONSTRAINT FK_Submissions_Users FOREIGN KEY (UnderwriterUserId) REFERENCES dbo.Users(Id)
);

CREATE TABLE dbo.RiskAnswers (
  Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  SubmissionId INT NOT NULL,
  QuestionCode NVARCHAR(50) NOT NULL,
  QuestionText NVARCHAR(1000) NULL,
  AnswerText NVARCHAR(2000) NULL,
  AnswerNumeric DECIMAL(18,2) NULL,
  RowVersion ROWVERSION,
  CONSTRAINT FK_RiskAnswers_Submissions FOREIGN KEY (SubmissionId) REFERENCES dbo.Submissions(Id) ON DELETE CASCADE
);

CREATE TABLE dbo.Quotes (
  Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  QuoteNumber NVARCHAR(30) NOT NULL,
  SubmissionId INT NOT NULL,
  VersionNumber INT NOT NULL CONSTRAINT DF_Quotes_Ver DEFAULT(1),
  SumInsured DECIMAL(18,2) NOT NULL,
  LimitOfIndemnity DECIMAL(18,2) NOT NULL,
  Deductible DECIMAL(18,2) NOT NULL,
  GrossPremium DECIMAL(18,2) NOT NULL,
  NetPremium DECIMAL(18,2) NOT NULL,
  CommissionPercent DECIMAL(9,4) NOT NULL CONSTRAINT DF_Quotes_Comm DEFAULT(0),
  CommissionAmount DECIMAL(18,2) NOT NULL CONSTRAINT DF_Quotes_CommAmt DEFAULT(0),
  IsReferralRequired BIT NOT NULL CONSTRAINT DF_Quotes_Ref DEFAULT(0),
  ReferralReason NVARCHAR(500) NULL,
  ReferralComments NVARCHAR(2000) NULL,
  ReferralDecision INT NOT NULL CONSTRAINT DF_Quotes_Dec DEFAULT(0),
  ReferralDecisionByUserId INT NULL,
  ReferralDecisionDate DATETIME2 NULL,
  RatingBreakdownJson NTEXT NULL,
  IsSelected BIT NOT NULL CONSTRAINT DF_Quotes_Sel DEFAULT(0),
  CreatedByUserId INT NULL,
  CreatedDate DATETIME2 NOT NULL,
  ExpiryDate DATETIME2 NOT NULL,
  Notes NVARCHAR(2000) NULL,
  RowVersion ROWVERSION,
  CONSTRAINT FK_Quotes_Submissions FOREIGN KEY (SubmissionId) REFERENCES dbo.Submissions(Id) ON DELETE CASCADE
);

CREATE TABLE dbo.Policies (
  Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  PolicyNumber NVARCHAR(30) NOT NULL,
  QuoteId INT NOT NULL,
  SubmissionId INT NOT NULL,
  BrokerId INT NOT NULL,
  InsuredId INT NOT NULL,
  LineOfBusiness INT NOT NULL,
  Status INT NOT NULL,
  EffectiveDate DATETIME2 NOT NULL,
  ExpiryDate DATETIME2 NOT NULL,
  GrossPremium DECIMAL(18,2) NOT NULL,
  NetPremium DECIMAL(18,2) NOT NULL,
  SumInsured DECIMAL(18,2) NOT NULL,
  LimitOfIndemnity DECIMAL(18,2) NOT NULL,
  Deductible DECIMAL(18,2) NOT NULL,
  BoundDate DATETIME2 NULL,
  BoundByUserId INT NULL,
  CancellationDate DATETIME2 NULL,
  CancellationReason NVARCHAR(1000) NULL,
  RenewedFromPolicyId INT NULL,
  RowVersion ROWVERSION,
  CONSTRAINT UQ_Policies_Number UNIQUE (PolicyNumber),
  CONSTRAINT FK_Policies_Quotes FOREIGN KEY (QuoteId) REFERENCES dbo.Quotes(Id),
  CONSTRAINT FK_Policies_Submissions FOREIGN KEY (SubmissionId) REFERENCES dbo.Submissions(Id),
  CONSTRAINT FK_Policies_Brokers FOREIGN KEY (BrokerId) REFERENCES dbo.Brokers(Id),
  CONSTRAINT FK_Policies_Insureds FOREIGN KEY (InsuredId) REFERENCES dbo.Insureds(Id)
);

CREATE TABLE dbo.Endorsements (
  Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  EndorsementNumber NVARCHAR(30) NOT NULL,
  PolicyId INT NOT NULL,
  Description NVARCHAR(1000) NULL,
  PremiumChange DECIMAL(18,2) NOT NULL CONSTRAINT DF_End_Prem DEFAULT(0),
  EffectiveDate DATETIME2 NOT NULL,
  Status NVARCHAR(30) NULL,
  CreatedByUserId INT NULL,
  CreatedDate DATETIME2 NOT NULL,
  RowVersion ROWVERSION,
  CONSTRAINT FK_Endorsements_Policies FOREIGN KEY (PolicyId) REFERENCES dbo.Policies(Id) ON DELETE CASCADE
);

CREATE TABLE dbo.Claims (
  Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  ClaimNumber NVARCHAR(30) NOT NULL,
  PolicyId INT NOT NULL,
  InsuredId INT NOT NULL,
  BrokerId INT NOT NULL,
  Status INT NOT NULL,
  LossDate DATETIME2 NOT NULL,
  NotifiedDate DATETIME2 NOT NULL,
  Description NVARCHAR(2000) NULL,
  ReserveAmount DECIMAL(18,2) NOT NULL CONSTRAINT DF_Claims_Res DEFAULT(0),
  PaidAmount DECIMAL(18,2) NOT NULL CONSTRAINT DF_Claims_Paid DEFAULT(0),
  HandlerUserId INT NULL,
  RowVersion ROWVERSION,
  CONSTRAINT UQ_Claims_Number UNIQUE (ClaimNumber),
  CONSTRAINT FK_Claims_Policies FOREIGN KEY (PolicyId) REFERENCES dbo.Policies(Id),
  CONSTRAINT FK_Claims_Insureds FOREIGN KEY (InsuredId) REFERENCES dbo.Insureds(Id),
  CONSTRAINT FK_Claims_Brokers FOREIGN KEY (BrokerId) REFERENCES dbo.Brokers(Id)
);

CREATE TABLE dbo.Documents (
  Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  FileName NVARCHAR(260) NOT NULL,
  StoredFileName NVARCHAR(260) NOT NULL,
  StoragePath NVARCHAR(500) NULL,
  ContentType NVARCHAR(150) NULL,
  DocumentType INT NOT NULL,
  FileSizeBytes BIGINT NOT NULL CONSTRAINT DF_Docs_Size DEFAULT(0),
  VersionNumber INT NOT NULL CONSTRAINT DF_Docs_Ver DEFAULT(1),
  IsLatestVersion BIT NOT NULL CONSTRAINT DF_Docs_Latest DEFAULT(1),
  ParentDocumentId INT NULL,
  SubmissionId INT NULL,
  PolicyId INT NULL,
  ClaimId INT NULL,
  UploadedByUserId INT NOT NULL,
  UploadedDate DATETIME2 NOT NULL,
  Notes NVARCHAR(2000) NULL,
  RowVersion ROWVERSION
);

CREATE TABLE dbo.DocumentAccessLogs (
  Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  DocumentId INT NOT NULL,
  UserId INT NOT NULL,
  AccessedAt DATETIME2 NOT NULL,
  AccessType NVARCHAR(30) NOT NULL,
  RowVersion ROWVERSION
);

CREATE TABLE dbo.AuthorityRules (
  Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  Role INT NOT NULL,
  LineOfBusiness INT NOT NULL,
  MaxPremium DECIMAL(18,2) NOT NULL,
  MaxSumInsured DECIMAL(18,2) NOT NULL,
  MaxLimit DECIMAL(18,2) NOT NULL,
  IsActive BIT NOT NULL CONSTRAINT DF_Auth_Active DEFAULT(1),
  RowVersion ROWVERSION
);

CREATE TABLE dbo.AuditLogs (
  Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  EntityName NVARCHAR(100) NOT NULL,
  EntityId INT NULL,
  Action NVARCHAR(100) NOT NULL,
  UserId INT NULL,
  Timestamp DATETIME2 NOT NULL,
  OldValue NTEXT NULL,
  NewValue NTEXT NULL,
  Details NTEXT NULL,
  RowVersion ROWVERSION
);

CREATE TABLE dbo.LoginAudits (
  Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  UserId INT NULL,
  Username NVARCHAR(100) NOT NULL,
  Success BIT NOT NULL,
  Timestamp DATETIME2 NOT NULL,
  IpAddress NVARCHAR(50) NULL,
  FailureReason NVARCHAR(500) NULL,
  RowVersion ROWVERSION
);

CREATE TABLE dbo.WorkflowTasks (
  Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  Title NVARCHAR(200) NOT NULL,
  Description NVARCHAR(2000) NULL,
  Priority NVARCHAR(20) NULL,
  Status INT NOT NULL,
  SubmissionId INT NULL,
  PolicyId INT NULL,
  ClaimId INT NULL,
  AssignedToUserId INT NOT NULL,
  DueDate DATETIME2 NULL,
  CreatedDate DATETIME2 NOT NULL,
  CompletedDate DATETIME2 NULL,
  RowVersion ROWVERSION
);

CREATE TABLE dbo.Notifications (
  Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  UserId INT NOT NULL,
  Title NVARCHAR(200) NOT NULL,
  Message NVARCHAR(2000) NOT NULL,
  IsRead BIT NOT NULL CONSTRAINT DF_Notif_Read DEFAULT(0),
  CreatedDate DATETIME2 NOT NULL,
  LinkUrl NVARCHAR(500) NULL,
  RelatedEntityType NVARCHAR(100) NULL,
  RelatedEntityId INT NULL,
  RowVersion ROWVERSION
);

CREATE TABLE dbo.RateTables (
  Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  LineOfBusiness INT NOT NULL,
  TradeId INT NULL,
  BaseRatePer1000 DECIMAL(18,4) NOT NULL,
  MinPremium DECIMAL(18,2) NOT NULL,
  EffectiveDate DATETIME2 NOT NULL,
  EffectiveTo DATETIME2 NULL,
  IsActive BIT NOT NULL CONSTRAINT DF_Rates_Active DEFAULT(1),
  RowVersion ROWVERSION
);

CREATE TABLE dbo.ReferralRules (
  Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  LineOfBusiness INT NOT NULL,
  TradeId INT NULL,
  MinSumInsured DECIMAL(18,2) NULL,
  MaxSumInsured DECIMAL(18,2) NULL,
  MinLimit DECIMAL(18,2) NULL,
  MaxLimit DECIMAL(18,2) NULL,
  TriggersOnRestrictedTrade BIT NOT NULL CONSTRAINT DF_RefRules_Restricted DEFAULT(0),
  Reason NVARCHAR(500) NOT NULL,
  IsActive BIT NOT NULL CONSTRAINT DF_RefRules_Active DEFAULT(1),
  RowVersion ROWVERSION
);

CREATE TABLE dbo.SystemParameters (
  Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  [Key] NVARCHAR(100) NOT NULL,
  Value NVARCHAR(1000) NOT NULL,
  Description NVARCHAR(500) NULL,
  DataType NVARCHAR(30) NULL,
  RowVersion ROWVERSION,
  CONSTRAINT UQ_SystemParameters_Key UNIQUE ([Key])
);

CREATE TABLE dbo.HolidayCalendars (
  Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  HolidayDate DATETIME2 NOT NULL,
  Description NVARCHAR(200) NULL,
  CountryCode NVARCHAR(10) NULL,
  RowVersion ROWVERSION
);
GO

PRINT 'ApexInsurance schema created.';
GO
