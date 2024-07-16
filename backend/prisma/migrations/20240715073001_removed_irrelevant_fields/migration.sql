/*
  Warnings:

  - You are about to drop the column `first_name` on the `Attendees` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `Attendees` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `Users` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[Users] DROP CONSTRAINT [Users_phone_number_key];

-- AlterTable
ALTER TABLE [dbo].[Attendees] DROP COLUMN [first_name],
[last_name];

-- AlterTable
ALTER TABLE [dbo].[Users] DROP COLUMN [phone_number];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
