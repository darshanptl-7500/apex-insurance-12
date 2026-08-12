/*
  London Market / UW parity fields (Open Box replica layer).
  Safe to re-run: adds columns/tables only if missing.
*/
IF OBJECT_ID(N'dbo.RiskMarketDetails', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.RiskMarketDetails (
    SubmissionId INT NOT NULL PRIMARY KEY,
    UwReference NVARCHAR(40) NULL,
    Yoa INT NULL,
    Umr NVARCHAR(40) NULL,
    BrokerReference NVARCHAR(80) NULL,
    BrokerContact NVARCHAR(200) NULL,
    Mop NVARCHAR(40) NULL,
    PolicyType NVARCHAR(40) NULL,
    PolicyDescription NVARCHAR(1000) NULL,
    RiskAppetite NVARCHAR(40) NULL,
    BusinessArea NVARCHAR(40) NULL,
    StatCode1 NVARCHAR(20) NULL,
    StatCode2 NVARCHAR(20) NULL,
    SubStat1 NVARCHAR(40) NULL,
    NewOrRenewal NVARCHAR(10) NULL,
    IsDelegatedAuthority BIT NOT NULL CONSTRAINT DF_RMD_DA DEFAULT(0),
    IsNonRenewable BIT NOT NULL CONSTRAINT DF_RMD_NR DEFAULT(0),
    ExpiryDate DATETIME2 NULL,
    Reinsured NVARCHAR(200) NULL,
    Domicile NVARCHAR(80) NULL,
    SlipLeader NVARCHAR(120) NULL,
    Syndicate NVARCHAR(20) NULL,
    RiskCode NVARCHAR(20) NULL,
    WrittenLine DECIMAL(9,4) NULL,
    SignedLine DECIMAL(9,4) NULL,
    EstSigning DECIMAL(9,4) NULL,
    ActSigning DECIMAL(9,4) NULL,
    BrokerOrder DECIMAL(9,4) NULL,
    NetSharePremium DECIMAL(18,2) NULL,
    ExpectedPremium DECIMAL(18,2) NULL,
    WeightedTi DECIMAL(18,4) NULL,
    WeightedRrm DECIMAL(18,4) NULL,
    LongTermLossRatio DECIMAL(9,4) NULL,
    RateAdequacy DECIMAL(9,4) NULL,
    TechnicalIndex DECIMAL(18,4) NULL,
    EsgStatus NVARCHAR(40) NULL,
    NotesType NVARCHAR(20) NULL,
    LastTouchedUtc DATETIME2 NULL,
    CONSTRAINT FK_RiskMarketDetails_Submissions FOREIGN KEY (SubmissionId) REFERENCES dbo.Submissions(Id) ON DELETE CASCADE
  );
END
GO

IF OBJECT_ID(N'dbo.IntegrationActivity', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.IntegrationActivity (
    Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    OccurredUtc DATETIME2 NOT NULL,
    SystemName NVARCHAR(40) NOT NULL,
    Direction NVARCHAR(20) NOT NULL,
    ActionName NVARCHAR(80) NOT NULL,
    Reference NVARCHAR(80) NULL,
    Status NVARCHAR(20) NOT NULL,
    Message NVARCHAR(1000) NULL,
    ElapsedMs INT NULL
  );
END
GO

IF OBJECT_ID(N'dbo.ScheduledJobs', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.ScheduledJobs (
    Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    JobName NVARCHAR(120) NOT NULL,
    ScheduleType NVARCHAR(80) NOT NULL,
    RagStatus NVARCHAR(20) NOT NULL,
    LastRunUtc DATETIME2 NULL,
    JobStatus NVARCHAR(40) NOT NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_Jobs_Active DEFAULT(1)
  );
END
GO
