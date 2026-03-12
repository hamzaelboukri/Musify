import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { S3Service } from './s3.service';

const AUDIO_DIR = join(process.cwd(), 'uploads', 'audio');
const IMAGE_DIR = join(process.cwd(), 'uploads', 'images');

const audioStorage = diskStorage({
  destination: (_req, _file, cb) => cb(null, AUDIO_DIR),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + extname(file.originalname) || '.mp3');
  },
});

const audioFilter = (_req: unknown, file: Express.Multer.File, cb: (err: Error | null, accept: boolean) => void) => {
  const allowed = /\.(mp3|m4a|wav|ogg)$/i.test(file.originalname);
  cb(null, allowed);
};

const imageFilter = (_req: unknown, file: Express.Multer.File, cb: (err: Error | null, accept: boolean) => void) => {
  const allowed = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.originalname);
  cb(null, allowed);
};

// Memory storage for images - used when S3 is enabled (need buffer) or to write to disk manually
const imageMemoryStorage = memoryStorage();

@Controller('upload')
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}

  @Post('audio')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SINGER', 'ADMIN')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: audioStorage,
      fileFilter: audioFilter,
      limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
    }),
  )
  uploadAudio(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No audio file provided');
    const baseUrl = (process.env.API_URL || `http://localhost:${process.env.PORT || 3001}`).replace(/\/api\/?$/, '');
    return { url: `${baseUrl}/uploads/audio/${file.filename}` };
  }

  @Post('image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SINGER', 'ADMIN')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: imageMemoryStorage,
      fileFilter: imageFilter,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No image file provided');

    const ext = extname(file.originalname) || '.jpg';
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

    if (this.s3Service.isEnabled()) {
      const url = await this.s3Service.uploadImage(
        file.buffer,
        filename,
        file.mimetype || 'image/jpeg',
      );
      return { url };
    }

    // Fallback: local filesystem storage
    if (!existsSync(IMAGE_DIR)) {
      mkdirSync(IMAGE_DIR, { recursive: true });
    }
    const filepath = join(IMAGE_DIR, filename);
    writeFileSync(filepath, file.buffer);

    const baseUrl = (process.env.API_URL || `http://localhost:${process.env.PORT || 3001}`).replace(/\/api\/?$/, '');
    return { url: `${baseUrl}/uploads/images/${filename}` };
  }
}
