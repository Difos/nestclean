import { AttachmentsRepository } from "@/domain/forum/application/repositories/attachment-repository";
import { Attachment } from "@/domain/forum/enterprise/entities/attachment";

export class InMemoryAttachmentRepository implements AttachmentsRepository {
    public itens : Attachment[] = []
    async create(attachment: Attachment) {
        this.itens.push(attachment)
    }
}