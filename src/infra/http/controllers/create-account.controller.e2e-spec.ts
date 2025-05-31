import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create account (E2E)', () => {
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

  test('[POST] /accounts', async () => {
    const testEmail = `test-${Date.now()}@example.com`

    // Cria a conta
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'Test User',
      email: testEmail,
      password: '123456',
    })

    // Verifica a resposta
    expect(response.statusCode).toBe(201)

    // Verifica o banco de testes
    const user = await prisma.user.findUnique({
      where: { email: testEmail },
    })

    expect(user).toBeTruthy()
  })

  afterAll(async () => {
    await app.close()
  })
})
