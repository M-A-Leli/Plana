CREATE DATABASE Plana;
GO

USE Plana;
GO

-- DECLARE @sql NVARCHAR(MAX)

-- SET @sql = ''

-- SELECT @sql = @sql + 'DELETE FROM ' + QUOTENAME(TABLE_SCHEMA) + '.' + QUOTENAME(TABLE_NAME) + ';' 
-- FROM Plana.INFORMATION_SCHEMA.TABLES
-- WHERE TABLE_TYPE = 'BASE TABLE'  -- Only consider user tables (not views)
--   AND TABLE_SCHEMA = 'dbo'       -- Change schema name if needed

-- -- PRINT @sql   -- Uncomment to debug and see the generated SQL

-- EXEC sp_executesql @sql


SELECT * FROM Users;

-- 2bb52a6a-441d-4312-968d-80ab9024d955
-- UPDATE Users SET is_deleted = 0, is_suspended = 0;
-- UPDATE Users SET is_deleted = 1 WHERE id = 'da0f30e5-d763-4300-9756-8952b3ccaddd';
-- UPDATE Users SET is_suspended = 1 WHERE id = '6d8768bd-db90-413c-8af7-2d41b5ad3ab9';
-- UPDATE Users SET password = '$2b$10$G8AWm9bFHk25/F0cSNgn8OIJpdfBmrys4VqlI6oatC.lmuwrHf5Ly';
Delete from Users WHERE id = 'ca1e5ecb-25d6-4e98-b5d4-721698649e8e';

-- UPDATE Users SET profile_img = 'http://localhost:3000/images/default_profile_image.svg' WHERE id = '1104d057-73a0-4d44-bb0f-483282c60b27';

SELECT * FROM Admins;

-- UPDATE Admins SET is_deleted = 0;

SELECT * FROM Attendees;

-- UPDATE Attendees SET is_deleted = 0;
-- UPDATE Attendees SET is_deleted = 1 WHERE user_id = 'da0f30e5-d763-4300-9756-8952b3ccaddd';

-- Delete from Attendees WHERE id = '7D40B311-B13D-4383-B296-CA421BF4B41D';
-- Delete from Attendees WHERE user_id = '67684951-a4b5-4649-a03e-208838aff2ed';

SELECT * FROM Organizers;

-- UPDATE Organizers SET is_deleted = 0;
-- UPDATE Organizers SET is_deleted = 0, approved = 1 WHERE id = '31696010-835d-4e06-94a5-1c9cda0b4817';
-- DELETE Organizers WHERE user_id = '67684951-a4b5-4649-a03e-208838aff2ed';
-- INSERT INTO Attendees (id, user_id, bio, is_deleted)
-- SELECT NEWID(), user_id, bio, is_deleted
-- FROM Organizers;


SELECT * FROM Events;
-- UPDATE Events SET date = '2024-08-01 18:36:55.9280000', start_time = '13:15:00 GMT+0300 (East Africa Time)', end_time = '15:45:00 GMT+0300 (East Africa Time)';

-- WITH RandomEvents AS (
--     SELECT TOP 8 *
--     FROM (
--         SELECT *,
--                ROW_NUMBER() OVER (ORDER BY NEWID()) AS RowNum
--         FROM Events
--     ) AS Randomized
--     WHERE RowNum <= 8
-- )
-- UPDATE RandomEvents
-- SET is_featured = 1;

SELECT * FROM Categories;

SELECT * FROM EventImages;

SELECT * FROM TicketTypes;

SELECT * FROM Tickets;

SELECT * FROM Orders;

SELECT * FROM Attendees WHERE user_id = '2bb52a6a-441d-4312-968d-80ab9024d955';
SELECT * FROM Orders WHERE attendee_id = '42bf947c-122f-46a3-9dda-d5e28babe214';
SELECT * FROM Orders WHERE attendee_id = '42bf947c-122f-46a3-9dda-d5e28babe214';

SELECT * FROM Reviews;

SELECT * FROM PasswordResetCodes;

SELECT * FROM Payments;

SELECT * FROM Notifications;