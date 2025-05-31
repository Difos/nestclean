BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[users] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [users_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [users_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[questions] (
    [id] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [slug] NVARCHAR(1000) NOT NULL,
    [content] NVARCHAR(1000) NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [questions_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2,
    [author_id] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [questions_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [questions_slug_key] UNIQUE NONCLUSTERED ([slug])
);

-- AddForeignKey
ALTER TABLE [dbo].[questions] ADD CONSTRAINT [questions_author_id_fkey] FOREIGN KEY ([author_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
