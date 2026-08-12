/*
  Workbench depth columns for UW Edit / section KPIs.
  Safe to re-run.
*/
IF COL_LENGTH('dbo.RiskMarketDetails', 'RenewalWarning') IS NULL
  ALTER TABLE dbo.RiskMarketDetails ADD RenewalWarning BIT NOT NULL CONSTRAINT DF_RMD_RW DEFAULT(0);
IF COL_LENGTH('dbo.RiskMarketDetails', 'PrincipalUw') IS NULL
  ALTER TABLE dbo.RiskMarketDetails ADD PrincipalUw NVARCHAR(120) NULL;
IF COL_LENGTH('dbo.RiskMarketDetails', 'SubStat2') IS NULL
  ALTER TABLE dbo.RiskMarketDetails ADD SubStat2 NVARCHAR(40) NULL;
IF COL_LENGTH('dbo.RiskMarketDetails', 'EtradingPlatform') IS NULL
  ALTER TABLE dbo.RiskMarketDetails ADD EtradingPlatform NVARCHAR(80) NULL;
IF COL_LENGTH('dbo.RiskMarketDetails', 'LicSecondee') IS NULL
  ALTER TABLE dbo.RiskMarketDetails ADD LicSecondee NVARCHAR(120) NULL;
IF COL_LENGTH('dbo.RiskMarketDetails', 'DedXs') IS NULL
  ALTER TABLE dbo.RiskMarketDetails ADD DedXs DECIMAL(18,2) NULL;
IF COL_LENGTH('dbo.RiskMarketDetails', 'PremRate') IS NULL
  ALTER TABLE dbo.RiskMarketDetails ADD PremRate DECIMAL(18,6) NULL;
IF COL_LENGTH('dbo.RiskMarketDetails', 'RiskChange') IS NULL
  ALTER TABLE dbo.RiskMarketDetails ADD RiskChange DECIMAL(18,4) NULL;
IF COL_LENGTH('dbo.RiskMarketDetails', 'TcChange') IS NULL
  ALTER TABLE dbo.RiskMarketDetails ADD TcChange DECIMAL(18,4) NULL;
IF COL_LENGTH('dbo.RiskMarketDetails', 'OtherChange') IS NULL
  ALTER TABLE dbo.RiskMarketDetails ADD OtherChange DECIMAL(18,4) NULL;
IF COL_LENGTH('dbo.RiskMarketDetails', 'ModelledLr') IS NULL
  ALTER TABLE dbo.RiskMarketDetails ADD ModelledLr DECIMAL(18,4) NULL;
IF COL_LENGTH('dbo.RiskMarketDetails', 'FacilityFlag') IS NULL
  ALTER TABLE dbo.RiskMarketDetails ADD FacilityFlag BIT NOT NULL CONSTRAINT DF_RMD_FAC DEFAULT(0);
IF COL_LENGTH('dbo.RiskMarketDetails', 'LbsFlag') IS NULL
  ALTER TABLE dbo.RiskMarketDetails ADD LbsFlag BIT NOT NULL CONSTRAINT DF_RMD_LBS DEFAULT(1);
IF COL_LENGTH('dbo.RiskMarketDetails', 'LicFlag') IS NULL
  ALTER TABLE dbo.RiskMarketDetails ADD LicFlag BIT NOT NULL CONSTRAINT DF_RMD_LIC DEFAULT(0);
GO

IF COL_LENGTH('dbo.WorkflowTasks', 'TaskType') IS NULL
  ALTER TABLE dbo.WorkflowTasks ADD TaskType NVARCHAR(40) NULL;
IF COL_LENGTH('dbo.WorkflowTasks', 'DocumentId') IS NULL
  ALTER TABLE dbo.WorkflowTasks ADD DocumentId INT NULL;
IF COL_LENGTH('dbo.WorkflowTasks', 'CreatedByUserId') IS NULL
  ALTER TABLE dbo.WorkflowTasks ADD CreatedByUserId INT NULL;
IF COL_LENGTH('dbo.WorkflowTasks', 'CompletedByUserId') IS NULL
  ALTER TABLE dbo.WorkflowTasks ADD CompletedByUserId INT NULL;
IF COL_LENGTH('dbo.WorkflowTasks', 'Reference') IS NULL
  ALTER TABLE dbo.WorkflowTasks ADD Reference NVARCHAR(80) NULL;
IF COL_LENGTH('dbo.WorkflowTasks', 'LloydsPin') IS NULL
  ALTER TABLE dbo.WorkflowTasks ADD LloydsPin NVARCHAR(40) NULL;
IF COL_LENGTH('dbo.WorkflowTasks', 'QuestionnaireJson') IS NULL
  ALTER TABLE dbo.WorkflowTasks ADD QuestionnaireJson NVARCHAR(MAX) NULL;
GO

IF OBJECT_ID(N'dbo.TaskComments', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.TaskComments (
    Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    TaskId INT NOT NULL,
    AuthorUserId INT NOT NULL,
    Body NVARCHAR(2000) NOT NULL,
    CreatedUtc DATETIME2 NOT NULL,
    CONSTRAINT FK_TaskComments_Tasks FOREIGN KEY (TaskId) REFERENCES dbo.WorkflowTasks(Id) ON DELETE CASCADE
  );
END
GO
