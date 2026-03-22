import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { S3Service } from './s3.service';

describe('UploadController', () => {
  let controller: UploadController;
  let s3Service: jest.Mocked<S3Service>;

  const mockS3Service = {
    isEnabled: jest.fn().mockReturnValue(false),
    uploadAudio: jest.fn(),
    uploadImage: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [{ provide: S3Service, useValue: mockS3Service }],
    }).compile();

    controller = module.get<UploadController>(UploadController);
  });

  it('should be defined', () => expect(controller).toBeDefined());

  it('uploadAudio throws BadRequestException when no file', async () => {
    await expect(controller.uploadAudio(undefined as any)).rejects.toThrow(BadRequestException);
  });

  it('uploadImage throws BadRequestException when no file', async () => {
    await expect(controller.uploadImage(undefined as any)).rejects.toThrow(BadRequestException);
  });
});
