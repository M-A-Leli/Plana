BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Admins] ADD [is_deleted] BIT NOT NULL CONSTRAINT [Admins_is_deleted_df] DEFAULT 0;

-- AlterTable
ALTER TABLE [dbo].[Attendees] ADD [is_deleted] BIT NOT NULL CONSTRAINT [Attendees_is_deleted_df] DEFAULT 0;

-- AlterTable
ALTER TABLE [dbo].[Organizers] ADD [is_deleted] BIT NOT NULL CONSTRAINT [Organizers_is_deleted_df] DEFAULT 0;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
