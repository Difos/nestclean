import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { DatabaseModule } from "@faker-js/faker/.";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest";
import { StudentFactory } from "test/factories/make-student";

describe("Create question (E2E)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let studentFactory: StudentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    await app.init();
  });

  test("[POST /questions", async () => {
    const user = await studentFactory.makePrismaStudent();

    const AccessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .post("/questions")
      .set("Authorization", `Bearer ${AccessToken}`)
      .send({
        title: "new question",
        content: "Question content",
      });

    expect(response.statusCode).toBe(201);

    const questionOnDataBase = await prisma.question.findFirst({
      where: {
        title: "new question",
      },
    });

    expect(questionOnDataBase).toBeTruthy();
  });
});
