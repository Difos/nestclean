import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { CurrentUser } from 'src/infra/auth/current-user-decorator'
import { TokenPayload } from 'src/infra/auth/jwt.strategy'
import { z } from 'zod'

const deleteQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type DeleteQuestionBodySchema = z.infer<typeof deleteQuestionBodySchema>
@Controller('/questions:id')
export class DeleteQuestionController {
  constructor(private deleteQuestion: DeleteQuestionUseCase) {}
  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: TokenPayload,
    @Param('id') questionId: string,
  ) {
    const userId = user.sub
    const result = await this.deleteQuestion.execute({
      questionId,
      authorId: userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
