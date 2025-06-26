import { InMemoryAttachmentRepository } from "test/repositories/in-memory-attachment-repository";
import { UploadAndCreateAttachmentUseCase } from "./upload-and-create-attachment";
import { FakeUploader } from "test/storage/faker-uploader";
import { InvalidAttachmentType } from "./errors/invalid-attachment-type";

let inMemoryAttachmentRepository: InMemoryAttachmentRepository;
let uploader: FakeUploader;
let sut: UploadAndCreateAttachmentUseCase;

describe("Upload and create attachment", () => {
  beforeEach(() => {
    inMemoryAttachmentRepository = new InMemoryAttachmentRepository();
    uploader = new FakeUploader();
    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentRepository,
      uploader
    );
  });

  it("should be able upload and create an attachment", async () => {
    const result = await sut.execute({
      fileName: "profile.png",
      fileType: "image/png",
      body: Buffer.from(""),
    });

    expect(result.isRight()).toBe(true);

    expect(result.value).toEqual({
      attachment: inMemoryAttachmentRepository.itens[0],
    });

    expect(uploader.uploads).toHaveLength(1);
    expect(uploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: "profile.png",
      })
    );
  });

  it("it shouldnt able upload and create an attachment file without type png, jpeg, jpg or pdf", async () => {
    const result = await sut.execute({
      fileName: "profile.mp3",
      fileType: "audio/png",
      body: Buffer.from(""),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidAttachmentType);
  });
});
