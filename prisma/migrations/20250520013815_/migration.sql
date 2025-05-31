/*
  Warnings:

  - A unique constraint covering the columns `[best_answer_id]` on the table `questions` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[questions] ADD [best_answer_id] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[users] ADD [role] NVARCHAR(1000) NOT NULL CONSTRAINT [users_role_df] DEFAULT 'STUDENT';

-- CreateTable
CREATE TABLE [dbo].[answers] (
    [id] NVARCHAR(1000) NOT NULL,
    [content] NVARCHAR(1000) NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [answers_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2,
    [author_id] NVARCHAR(1000) NOT NULL,
    [question_id] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [answers_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
ALTER TABLE [dbo].[questions] ADD CONSTRAINT [questions_best_answer_id_key] UNIQUE NONCLUSTERED ([best_answer_id]);

-- AddForeignKey
ALTER TABLE [dbo].[questions] ADD CONSTRAINT [questions_best_answer_id_fkey] FOREIGN KEY ([best_answer_id]) REFERENCES [dbo].[answers]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[answers] ADD CONSTRAINT [answers_author_id_fkey] FOREIGN KEY ([author_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[answers] ADD CONSTRAINT [answers_question_id_fkey] FOREIGN KEY ([question_id]) REFERENCES [dbo].[questions]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
