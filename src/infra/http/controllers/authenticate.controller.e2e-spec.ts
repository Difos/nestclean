import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Authenticate account (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    // Configuração do módulo de teste
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    await app.init()
  })

  test('[POST] /sessions', async () => {
    const testEmail = `test-${Date.now()}@example.com`

    await prisma.user.create({
      data: {
        name: 'Test User',
        email: testEmail,
        password: await hash('123456', 8),
      },
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: testEmail,
      password: '123456',
    })

    // Verifica a resposta
    expect(response.statusCode).toBe(201)

    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
