import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { UploadsServeController } from './uploads-serve.controller';
import { existsSync } from 'fs';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

describe('UploadsServeController', () => {
  let controller: UploadsServeController;
  let mockRes: Partial<Response>;

  beforeEach(async () => {
    mockRes = {
      sendFile: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      headersSent: false,
    };
    (existsSync as jest.Mock).mockReturnValue(false);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadsServeController],
    }).compile();

    controller = module.get<UploadsServeController>(UploadsServeController);
  });

  it('should be defined', () => expect(controller).toBeDefined());

  it('serveImage throws NotFoundException when file does not exist', () => {
    expect(() => controller.serveImage('test.jpg', mockRes as Response)).toThrow(NotFoundException);
  });

  it('serveAudio throws NotFoundException when file does not exist', () => {
    expect(() => controller.serveAudio('test.mp3', mockRes as Response)).toThrow(NotFoundException);
  });
});
