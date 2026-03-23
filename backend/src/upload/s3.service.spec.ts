import { Test, TestingModule } from '@nestjs/testing';
import { S3Service } from './s3.service';

describe('S3Service', () => {
  let service: S3Service;

  const origEnv = process.env;

  beforeEach(async () => {
    jest.resetModules();
    process.env = { ...origEnv };
    delete process.env.AWS_S3_BUCKET;
    delete process.env.AWS_ACCESS_KEY_ID;
    delete process.env.AWS_SECRET_ACCESS_KEY;

    const module: TestingModule = await Test.createTestingModule({
      providers: [S3Service],
    }).compile();

    service = module.get<S3Service>(S3Service);
  });

  afterEach(() => {
    process.env = origEnv;
  });

  it('should be defined', () => expect(service).toBeDefined());

  it('isEnabled returns false when AWS not configured', () => {
    expect(service.isEnabled()).toBe(false);
  });
});
