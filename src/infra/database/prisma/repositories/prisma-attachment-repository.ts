import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachment-repository'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { PrismaAttachmentMapper } from '../mappers/prima-attachment-mapper'

@Injectable()
export class PrismaAttachmentRepository implements AttachmentsRepository {
  constructor(private prisma: PrismaService) {}
  

  async create(attachment: Attachment): Promise<void> {
    const data = PrismaAttachmentMapper.toPersistence(attachment)
    await this.prisma.attachment.create({
      data,
    })
  }
}
