import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionAttachmentFactory } from "test/factories/make-question-attachments";
import { M } from "vitest/dist/chunks/reporters.d.DL9pg5DB";

describe("Edit question (E2E)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let questionFactory: QuestionFactory;
  let studentFactory: StudentFactory;
  let attachmentFactory: AttachmentFactory;
  let questionAttachmentFactory: QuestionAttachmentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionAttachmentFactory,
        AttachmentFactory,
        QuestionFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);

    await app.init();
  });

  test("[PUT /questions/:id", async () => {
    const user = await studentFactory.makePrismaStudent();

    const AccessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const attachment1 = await attachmentFactory.makePrismaAttachment();
    const attachment2 = await attachmentFactory.makePrismaAttachment();

    await Promise.all([
      questionAttachmentFactory.makePrismaQuestionAttachment({
        attachmentId: attachment1.id,
        questionId: question.id,
      }),

      questionAttachmentFactory.makePrismaQuestionAttachment({
        attachmentId: attachment2.id,
        questionId: question.id,
      }),
    ]);

    const attachment3 = await attachmentFactory.makePrismaAttachment();

    const questionId = question.id.toString();

    const response = await request(app.getHttpServer())
      .put(`/questions/:${questionId}`)
      .set("Authorization", `Bearer ${AccessToken}`)
      .send({
        title: "new title",
        content: "new content 1",
        attachments: [
          attachment1.id.toString(),
          attachment3.id.toString()
        ]
      });

    expect(response.statusCode).toBe(204);

    const questionOnDataBase = await prisma.question.findFirst({
      where: {
        title: "new title",
        content: "new content 1",
      },
    });

    expect(questionOnDataBase).toBeTruthy();


    const attachmentOnDataBase = await prisma.attachment.findMany({
      where: {
        questionId: questionOnDataBase?.id
      },
    });

    expect(attachmentOnDataBase).toHaveLength(2)
  });
});
