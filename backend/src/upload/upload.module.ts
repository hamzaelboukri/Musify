import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadsServeController } from './uploads-serve.controller';
import { S3Service } from './s3.service';

@Module({
  controllers: [UploadController, UploadsServeController],
  providers: [S3Service],
})
export class UploadModule {}
