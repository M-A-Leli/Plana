CREATE DATABASE Plana;
GO

USE Plana;
GO

SELECT * FROM Users;

-- UPDATE Users SET is_deleted = 0, is_suspended = 0;

-- UPDATE Users SET profile_img = 'http://localhost:3000/images/default_profile_image.svg' WHERE id = '1104d057-73a0-4d44-bb0f-483282c60b27';

SELECT * FROM Admins;

SELECT * FROM Attendees;

-- Delete from Attendees WHERE id = '7D40B311-B13D-4383-B296-CA421BF4B41D';

SELECT * FROM Organizers;

-- UPDATE Organizers SET is_deleted = 0, approved = 0;

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