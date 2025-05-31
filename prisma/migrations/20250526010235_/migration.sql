/*
  Warnings:

  - You are about to drop the `commets` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[commets] DROP CONSTRAINT [commets_answer_id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[commets] DROP CONSTRAINT [commets_author_id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[commets] DROP CONSTRAINT [commets_question_id_fkey];

-- DropTable
DROP TABLE [dbo].[commets];

-- CreateTable
CREATE TABLE [dbo].[comments] (
    [id] NVARCHAR(1000) NOT NULL,
    [content] NVARCHAR(1000) NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [comments_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2,
    [author_id] NVARCHAR(1000) NOT NULL,
    [question_id] NVARCHAR(1000),
    [answer_id] NVARCHAR(1000),
    [parentId] NVARCHAR(1000) NOT NULL,
    [parentType] NVARCHAR(1000) NOT NULL CONSTRAINT [comments_parentType_df] DEFAULT 'QUESTION',
    CONSTRAINT [comments_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[comments] ADD CONSTRAINT [comments_author_id_fkey] FOREIGN KEY ([author_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[comments] ADD CONSTRAINT [comments_question_id_fkey] FOREIGN KEY ([question_id]) REFERENCES [dbo].[questions]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[comments] ADD CONSTRAINT [comments_answer_id_fkey] FOREIGN KEY ([answer_id]) REFERENCES [dbo].[answers]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
