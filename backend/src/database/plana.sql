CREATE DATABASE Plana;
GO

USE Plana;
GO

SELECT * FROM Users;

-- UPDATE Users SET is_deleted = 0, is_suspended = 0;
-- UPDATE Users SET password = '$2b$10$G8AWm9bFHk25/F0cSNgn8OIJpdfBmrys4VqlI6oatC.lmuwrHf5Ly';
Delete from Users WHERE id = 'ca1e5ecb-25d6-4e98-b5d4-721698649e8e';

-- UPDATE Users SET profile_img = 'http://localhost:3000/images/default_profile_image.svg' WHERE id = '1104d057-73a0-4d44-bb0f-483282c60b27';

SELECT * FROM Admins;

-- UPDATE Admins SET is_deleted = 0;

SELECT * FROM Attendees;

-- UPDATE Attendees SET is_deleted = 0;

-- Delete from Attendees WHERE id = '7D40B311-B13D-4383-B296-CA421BF4B41D';
-- Delete from Attendees WHERE user_id = 'd612e9ca-001a-462c-95dc-4bf8a8d45994';

SELECT * FROM Organizers;

UPDATE Organizers SET is_deleted = 0;
-- UPDATE Organizers SET is_deleted = 0, approved = 1 WHERE id = '31696010-835d-4e06-94a5-1c9cda0b4817';

-- INSERT INTO Attendees (id, user_id, bio, is_deleted)
-- SELECT NEWID(), user_id, bio, is_deleted
-- FROM Organizers;


SELECT * FROM Events;

SELECT * FROM EventImages;

SELECT * FROM TicketTypes;

SELECT * FROM Tickets;

SELECT * FROM Reviews;

SELECT * FROM PasswordResetCodes;

SELECT * FROM Payments;

SELECT * FROM Notifications;