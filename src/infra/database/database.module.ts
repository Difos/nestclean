import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaQuestionRepository } from './prisma/repositories/prisma-question.repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository'
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prima-answers-attachments-repository'
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repositoy'
import { PrismaAnswerRepository } from './prisma/repositories/prisma-answers-repository'
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answers-comments-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { StudentRepository } from '@/domain/forum/application/repositories/students-repository'
import { PrismaStudentsRepository } from './prisma/repositories/prisma-students.repository'

@Module({
  providers: [PrismaService,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionRepository
    },
    {
      provide: StudentRepository,
      useClass: PrismaStudentsRepository
    },
    PrismaQuestionCommentsRepository, 
    PrismaQuestionAttachmentsRepository,
    PrismaAnswerRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerCommentsRepository
  ],
  exports: [PrismaService,
    QuestionsRepository,
    StudentRepository,
    PrismaQuestionCommentsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaAnswerRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerCommentsRepository
  ]
})
export class DatabaseModule {}
