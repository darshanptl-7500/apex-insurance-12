-- Optional: external party key for RabbitMQ InsuredCreated / InsuredUpdated upserts.
IF COL_LENGTH('dbo.Insureds', 'ExternalId') IS NULL
BEGIN
    ALTER TABLE dbo.Insureds ADD ExternalId NVARCHAR(80) NULL;
END
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes WHERE name = N'UX_Insureds_ExternalId' AND object_id = OBJECT_ID(N'dbo.Insureds')
)
BEGIN
    CREATE UNIQUE INDEX UX_Insureds_ExternalId
        ON dbo.Insureds(ExternalId)
        WHERE ExternalId IS NOT NULL;
END
GO
