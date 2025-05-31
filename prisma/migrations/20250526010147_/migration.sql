BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[commets] (
    [id] NVARCHAR(1000) NOT NULL,
    [content] NVARCHAR(1000) NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [commets_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2,
    [author_id] NVARCHAR(1000) NOT NULL,
    [question_id] NVARCHAR(1000),
    [answer_id] NVARCHAR(1000),
    [parentId] NVARCHAR(1000) NOT NULL,
    [parentType] NVARCHAR(1000) NOT NULL CONSTRAINT [commets_parentType_df] DEFAULT 'QUESTION',
    CONSTRAINT [commets_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[attachments] (
    [id] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [url] NVARCHAR(1000) NOT NULL,
    [question_id] NVARCHAR(1000),
    [answer_id] NVARCHAR(1000),
    CONSTRAINT [attachments_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[commets] ADD CONSTRAINT [commets_author_id_fkey] FOREIGN KEY ([author_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[commets] ADD CONSTRAINT [commets_question_id_fkey] FOREIGN KEY ([question_id]) REFERENCES [dbo].[questions]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[commets] ADD CONSTRAINT [commets_answer_id_fkey] FOREIGN KEY ([answer_id]) REFERENCES [dbo].[answers]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[attachments] ADD CONSTRAINT [attachments_question_id_fkey] FOREIGN KEY ([question_id]) REFERENCES [dbo].[questions]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[attachments] ADD CONSTRAINT [attachments_answer_id_fkey] FOREIGN KEY ([answer_id]) REFERENCES [dbo].[answers]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
