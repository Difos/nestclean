import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { StudentFactory } from '../../../../test/factories/make-student'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Authenticate account (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory

  beforeAll(async () => {
    // Configuração do módulo de teste
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    await app.init()
  })

  test('[POST] /sessions', async () => {
    const testEmail = `test-${Date.now()}@example.com`

    await studentFactory.makePrismaStudent({
      email: testEmail,
      password: await hash('123456', 8),
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
