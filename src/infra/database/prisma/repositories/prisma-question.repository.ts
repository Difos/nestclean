import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionMapper } from "../mappers/prisma-question-mapper";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";

@Injectable()
export class PrismaQuestionRepository implements QuestionsRepository {
  constructor(
    private prisma: PrismaService,
    private questionAttachmentsRepository: QuestionAttachmentsRepository
  ) {}
  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        id,
      },
    });

    if (!question) {
      return null;
    }

    return PrismaQuestionMapper.toDomain(question);
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
    });

    if (!question) {
      return null;
    }

    return PrismaQuestionMapper.toDomain(question);
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return questions.map(PrismaQuestionMapper.toDomain);
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPersistence(question);

    await Promise.all([
      this.prisma.question.update({
        where: {
          id: data.id,
        },
        data,
      }),
      this.questionAttachmentsRepository.createMany(
        question.attachments.getNewItems()
      ),
      this.questionAttachmentsRepository.deleteMany(
        question.attachments.getRemovedItems()
      ),
    ]);
  }

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPersistence(question);
    await this.prisma.question.create({
      data,
    });

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems()
    );
  }
  async delete(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPersistence(question);
    await this.prisma.question.delete({
      where: {
        id: data.id,
      },
    });
  }
}
