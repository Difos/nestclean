import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import {  Prisma, Attachment as PrismaAttachment } from '@prisma/client'

export class PrismaAttachmentMapper {
  
  static toPersistence(attachment: Attachment): Prisma.AttachmentUncheckedCreateInput {
    return {
        id: attachment.id.toString(),
        title : attachment.title,
        url: attachment.link,
    }
  }
}
