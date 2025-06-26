import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { CurrentUser } from 'src/infra/auth/current-user-decorator'
import { TokenPayload } from 'src/infra/auth/jwt.strategy'

@Controller('/answers/:id')
export class DeleteanswerController {
  constructor(private deleteanswer: DeleteAnswerUseCase) {}
  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: TokenPayload,
    @Param('id') answerId: string,
  ) {
    const userId = user.sub
    const result = await this.deleteanswer.execute({
      answerId,
      authorId: userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
