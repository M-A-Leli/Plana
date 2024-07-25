BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Users] (
    [id] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [salt] NVARCHAR(1000) NOT NULL,
    [username] NVARCHAR(1000) NOT NULL,
    [profile_img] NVARCHAR(1000),
    [is_deleted] BIT NOT NULL CONSTRAINT [Users_is_deleted_df] DEFAULT 0,
    [is_suspended] BIT NOT NULL CONSTRAINT [Users_is_suspended_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [Users_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [Users_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Users_email_key] UNIQUE NONCLUSTERED ([email]),
    CONSTRAINT [Users_username_key] UNIQUE NONCLUSTERED ([username])
);

-- CreateTable
CREATE TABLE [dbo].[Attendees] (
    [id] NVARCHAR(1000) NOT NULL,
    [user_id] NVARCHAR(1000) NOT NULL,
    [bio] NVARCHAR(1000),
    [is_deleted] BIT NOT NULL CONSTRAINT [Attendees_is_deleted_df] DEFAULT 0,
    CONSTRAINT [Attendees_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Attendees_user_id_key] UNIQUE NONCLUSTERED ([user_id])
);

-- CreateTable
CREATE TABLE [dbo].[Organizers] (
    [id] NVARCHAR(1000) NOT NULL,
    [user_id] NVARCHAR(1000) NOT NULL,
    [company] NVARCHAR(1000),
    [bio] NVARCHAR(1000),
    [is_deleted] BIT NOT NULL CONSTRAINT [Organizers_is_deleted_df] DEFAULT 0,
    [approved] BIT NOT NULL CONSTRAINT [Organizers_approved_df] DEFAULT 0,
    CONSTRAINT [Organizers_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Organizers_user_id_key] UNIQUE NONCLUSTERED ([user_id])
);

-- CreateTable
CREATE TABLE [dbo].[Admins] (
    [id] NVARCHAR(1000) NOT NULL,
    [user_id] NVARCHAR(1000) NOT NULL,
    [level] INT NOT NULL,
    [is_deleted] BIT NOT NULL CONSTRAINT [Admins_is_deleted_df] DEFAULT 0,
    CONSTRAINT [Admins_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Admins_user_id_key] UNIQUE NONCLUSTERED ([user_id])
);

-- CreateTable
CREATE TABLE [dbo].[PasswordResetCodes] (
    [id] NVARCHAR(1000) NOT NULL,
    [user_id] NVARCHAR(1000) NOT NULL,
    [code] NVARCHAR(1000) NOT NULL,
    [is_valid] BIT NOT NULL CONSTRAINT [PasswordResetCodes_is_valid_df] DEFAULT 1,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [PasswordResetCodes_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [expires_at] DATETIME2 NOT NULL,
    CONSTRAINT [PasswordResetCodes_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Events] (
    [id] NVARCHAR(1000) NOT NULL,
    [organizer_id] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [date] DATETIME2 NOT NULL,
    [start_time] NVARCHAR(1000) NOT NULL,
    [end_time] NVARCHAR(1000) NOT NULL,
    [venue] NVARCHAR(1000) NOT NULL,
    [category_id] NVARCHAR(1000) NOT NULL,
    [is_deleted] BIT NOT NULL CONSTRAINT [Events_is_deleted_df] DEFAULT 0,
    [is_featured] BIT NOT NULL CONSTRAINT [Events_is_featured_df] DEFAULT 0,
    [average_rating] FLOAT(53) NOT NULL CONSTRAINT [Events_average_rating_df] DEFAULT 0,
    [number_of_reviews] INT NOT NULL CONSTRAINT [Events_number_of_reviews_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [Events_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [Events_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[EventImages] (
    [id] NVARCHAR(1000) NOT NULL,
    [url] NVARCHAR(1000) NOT NULL,
    [event_id] NVARCHAR(1000) NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [EventImages_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [is_deleted] BIT NOT NULL CONSTRAINT [EventImages_is_deleted_df] DEFAULT 0,
    CONSTRAINT [EventImages_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Categories] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [is_deleted] BIT NOT NULL CONSTRAINT [Categories_is_deleted_df] DEFAULT 0,
    CONSTRAINT [Categories_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[TicketTypes] (
    [id] NVARCHAR(1000) NOT NULL,
    [event_id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [price] DECIMAL(32,16) NOT NULL,
    [availability] INT NOT NULL,
    [group_size] INT CONSTRAINT [TicketTypes_group_size_df] DEFAULT 1,
    [is_deleted] BIT NOT NULL CONSTRAINT [TicketTypes_is_deleted_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [TicketTypes_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [TicketTypes_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Tickets] (
    [id] NVARCHAR(1000) NOT NULL,
    [ticket_type_id] NVARCHAR(1000) NOT NULL,
    [order_id] NVARCHAR(1000) NOT NULL,
    [quantity] INT NOT NULL,
    [subtotal] DECIMAL(32,16) NOT NULL,
    [unique_code] NVARCHAR(1000) NOT NULL,
    [is_deleted] BIT NOT NULL CONSTRAINT [Tickets_is_deleted_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [Tickets_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [Tickets_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Tickets_unique_code_key] UNIQUE NONCLUSTERED ([unique_code])
);

-- CreateTable
CREATE TABLE [dbo].[Orders] (
    [id] NVARCHAR(1000) NOT NULL,
    [attendee_id] NVARCHAR(1000) NOT NULL,
    [event_id] NVARCHAR(1000) NOT NULL,
    [total] DECIMAL(32,16) NOT NULL,
    [payment_id] NVARCHAR(1000),
    [is_deleted] BIT NOT NULL CONSTRAINT [Orders_is_deleted_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [Orders_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [Orders_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Notifications] (
    [id] NVARCHAR(1000) NOT NULL,
    [user_id] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(1000) NOT NULL CONSTRAINT [Notifications_type_df] DEFAULT 'SYSTEM',
    [message] NVARCHAR(1000) NOT NULL,
    [read] BIT NOT NULL CONSTRAINT [Notifications_read_df] DEFAULT 0,
    [is_deleted] BIT NOT NULL CONSTRAINT [Notifications_is_deleted_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [Notifications_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Notifications_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Reviews] (
    [id] NVARCHAR(1000) NOT NULL,
    [attendee_id] NVARCHAR(1000) NOT NULL,
    [event_id] NVARCHAR(1000) NOT NULL,
    [rating] FLOAT(53) NOT NULL,
    [comment] NVARCHAR(1000) NOT NULL,
    [is_deleted] BIT NOT NULL CONSTRAINT [Reviews_is_deleted_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [Reviews_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Reviews_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Payments] (
    [id] NVARCHAR(1000) NOT NULL,
    [order_id] NVARCHAR(1000) NOT NULL,
    [amount] DECIMAL(32,16) NOT NULL,
    [payment_date] DATETIME2 NOT NULL CONSTRAINT [Payments_payment_date_df] DEFAULT CURRENT_TIMESTAMP,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Payments_status_df] DEFAULT 'PENDING',
    [is_deleted] BIT NOT NULL CONSTRAINT [Payments_is_deleted_df] DEFAULT 0,
    CONSTRAINT [Payments_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Payments_order_id_key] UNIQUE NONCLUSTERED ([order_id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Attendees] ADD CONSTRAINT [Attendees_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[Users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Organizers] ADD CONSTRAINT [Organizers_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[Users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Admins] ADD CONSTRAINT [Admins_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[Users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[PasswordResetCodes] ADD CONSTRAINT [PasswordResetCodes_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[Users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Events] ADD CONSTRAINT [Events_organizer_id_fkey] FOREIGN KEY ([organizer_id]) REFERENCES [dbo].[Organizers]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Events] ADD CONSTRAINT [Events_category_id_fkey] FOREIGN KEY ([category_id]) REFERENCES [dbo].[Categories]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[EventImages] ADD CONSTRAINT [EventImages_event_id_fkey] FOREIGN KEY ([event_id]) REFERENCES [dbo].[Events]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TicketTypes] ADD CONSTRAINT [TicketTypes_event_id_fkey] FOREIGN KEY ([event_id]) REFERENCES [dbo].[Events]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Tickets] ADD CONSTRAINT [Tickets_ticket_type_id_fkey] FOREIGN KEY ([ticket_type_id]) REFERENCES [dbo].[TicketTypes]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Tickets] ADD CONSTRAINT [Tickets_order_id_fkey] FOREIGN KEY ([order_id]) REFERENCES [dbo].[Orders]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Orders] ADD CONSTRAINT [Orders_attendee_id_fkey] FOREIGN KEY ([attendee_id]) REFERENCES [dbo].[Attendees]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Orders] ADD CONSTRAINT [Orders_event_id_fkey] FOREIGN KEY ([event_id]) REFERENCES [dbo].[Events]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Notifications] ADD CONSTRAINT [Notifications_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[Users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Reviews] ADD CONSTRAINT [Reviews_attendee_id_fkey] FOREIGN KEY ([attendee_id]) REFERENCES [dbo].[Attendees]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Reviews] ADD CONSTRAINT [Reviews_event_id_fkey] FOREIGN KEY ([event_id]) REFERENCES [dbo].[Events]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Payments] ADD CONSTRAINT [Payments_order_id_fkey] FOREIGN KEY ([order_id]) REFERENCES [dbo].[Orders]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
