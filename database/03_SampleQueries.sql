/* Sample MI queries for Apex Insurance */
USE ApexInsurance;
GO

-- Premium written vs team target (YTD)
SELECT t.Name AS TeamName,
       t.PremiumTargetYtd,
       ISNULL(SUM(p.GrossPremium), 0) AS GrossWrittenPremium,
       CASE WHEN t.PremiumTargetYtd = 0 THEN 0
            ELSE ROUND(ISNULL(SUM(p.GrossPremium), 0) / t.PremiumTargetYtd * 100, 1) END AS PctOfTarget
FROM dbo.Teams t
LEFT JOIN dbo.Users u ON u.TeamId = t.Id
LEFT JOIN dbo.Policies p ON p.BoundByUserId = u.Id AND p.Status = 0 AND YEAR(p.BoundDate) = YEAR(SYSUTCDATETIME())
GROUP BY t.Name, t.PremiumTargetYtd;

-- Broker league table
SELECT b.BrokerCode, b.Name,
       COUNT(DISTINCT s.Id) AS Submissions,
       COUNT(DISTINCT CASE WHEN s.Status = 4 THEN s.Id END) AS Bound,
       ISNULL(SUM(p.GrossPremium), 0) AS GWP,
       b.ProductionTarget
FROM dbo.Brokers b
LEFT JOIN dbo.Submissions s ON s.BrokerId = b.Id
LEFT JOIN dbo.Policies p ON p.BrokerId = b.Id AND p.Status = 0
GROUP BY b.BrokerCode, b.Name, b.ProductionTarget
ORDER BY GWP DESC;

-- Pipeline aging
SELECT Status,
       CASE
         WHEN DATEDIFF(DAY, CreatedDate, SYSUTCDATETIME()) < 3 THEN '0-2 days'
         WHEN DATEDIFF(DAY, CreatedDate, SYSUTCDATETIME()) < 8 THEN '3-7 days'
         WHEN DATEDIFF(DAY, CreatedDate, SYSUTCDATETIME()) < 15 THEN '8-14 days'
         ELSE '15+ days'
       END AS AgeBucket,
       COUNT(*) AS Cnt
FROM dbo.Submissions
WHERE Status IN (0,1,2,3) -- Received, Triaged, Quoted, Referred
GROUP BY Status,
       CASE
         WHEN DATEDIFF(DAY, CreatedDate, SYSUTCDATETIME()) < 3 THEN '0-2 days'
         WHEN DATEDIFF(DAY, CreatedDate, SYSUTCDATETIME()) < 8 THEN '3-7 days'
         WHEN DATEDIFF(DAY, CreatedDate, SYSUTCDATETIME()) < 15 THEN '8-14 days'
         ELSE '15+ days'
       END
ORDER BY Status, AgeBucket;
GO
