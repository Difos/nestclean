import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModuleBuilder } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Edit answer (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let studentFactory: StudentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)

    await app.init()
  })

  test('[PUT /answer/:id', async () => {
    const user = await studentFactory.makePrismaStudent()

    const AccessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const anwser = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id,
      content: 'answer content',
    })

    const answerId = anwser.id.toString()

    const response = await request(app.getHttpServer())
      .put(`/answer/:${answerId}/`)
      .set('Authorization', `Bearer ${AccessToken}`)
      .send({
        content: 'new answer content',
      })

    expect(response.statusCode).toBe(204)

    const answerOnDataBase = await prisma.answer.findFirst({
      where: {
        content: 'new answer content',
      },
    })

    expect(answerOnDataBase).toBeTruthy()
  })
})
