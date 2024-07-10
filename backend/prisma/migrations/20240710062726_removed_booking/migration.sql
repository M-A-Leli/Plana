/*
  Warnings:

  - You are about to drop the column `booking_id` on the `Payments` table. All the data in the column will be lost.
  - You are about to drop the `Bookings` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[ticket_id]` on the table `Payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ticket_id` to the `Payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `attendee_id` to the `Tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event_id` to the `Tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `TicketTypes` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Bookings] DROP CONSTRAINT [Bookings_attendee_id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Bookings] DROP CONSTRAINT [Bookings_event_id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Bookings] DROP CONSTRAINT [Bookings_ticket_id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Payments] DROP CONSTRAINT [Payments_booking_id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Tickets] DROP CONSTRAINT [Tickets_ticket_type_id_fkey];

-- DropIndex
ALTER TABLE [dbo].[Payments] DROP CONSTRAINT [Payments_booking_id_key];

-- AlterTable
ALTER TABLE [dbo].[Payments] DROP COLUMN [booking_id];
ALTER TABLE [dbo].[Payments] ADD [ticket_id] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[Tickets] ADD [attendee_id] NVARCHAR(1000) NOT NULL,
[event_id] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[TicketTypes] ADD [group_size] INT,
[name] NVARCHAR(1000) NOT NULL;

-- DropTable
DROP TABLE [dbo].[Bookings];

-- CreateIndex
ALTER TABLE [dbo].[Payments] ADD CONSTRAINT [Payments_ticket_id_key] UNIQUE NONCLUSTERED ([ticket_id]);

-- AddForeignKey
ALTER TABLE [dbo].[Tickets] ADD CONSTRAINT [Tickets_ticket_type_id_fkey] FOREIGN KEY ([ticket_type_id]) REFERENCES [dbo].[TicketTypes]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Tickets] ADD CONSTRAINT [Tickets_attendee_id_fkey] FOREIGN KEY ([attendee_id]) REFERENCES [dbo].[Attendees]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Tickets] ADD CONSTRAINT [Tickets_event_id_fkey] FOREIGN KEY ([event_id]) REFERENCES [dbo].[Events]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Payments] ADD CONSTRAINT [Payments_ticket_id_fkey] FOREIGN KEY ([ticket_id]) REFERENCES [dbo].[Tickets]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
