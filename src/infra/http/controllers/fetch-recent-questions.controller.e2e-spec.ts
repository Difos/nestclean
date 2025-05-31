import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Get question (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'wesley epeneto',
        email: 'wesley@example.com',
        password: await hash('123456', 8),
      },
    })

    const AccessToken = jwt.sign({ sub: user.id })

    await prisma.question.createMany({
      data: [
        {
          title: 'question 1',
          slug: 'question-1',
          content: 'question content 1',
          authorId: user.id,
        },
        {
          title: 'question 2',
          slug: 'question-2',
          content: 'question content 2',
          authorId: user.id,
        },
        {
          title: 'question 3',
          slug: 'question-3',
          content: 'question content 3',
          authorId: user.id,
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${AccessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: 'question 1' }),
        expect.objectContaining({ title: 'question 2' }),
        expect.objectContaining({ title: 'question 3' }),
      ],
    })
  })
})
