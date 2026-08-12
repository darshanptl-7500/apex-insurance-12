/* Optional: add Broker Ops demo user to an already-seeded database. Safe to re-run. */
IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE Username = N'bro1')
BEGIN
    SET IDENTITY_INSERT dbo.Users ON;
    INSERT INTO dbo.Users (Id, Username, Email, FullName, PasswordHash, PasswordSalt, Role, TeamId, AuthorityLimit, IsActive, CreatedDate)
    VALUES (5, N'bro1', N'bro1@apex.local', N'Blair Broker Ops', NULL, NULL, 2, 1, 0, 1, SYSUTCDATETIME());
    SET IDENTITY_INSERT dbo.Users OFF;
    PRINT 'Added bro1 (Broker Ops). Password: Password1!';
END
ELSE
    PRINT 'bro1 already exists.';
