import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

const AUDIO_DIR = join(process.cwd(), 'uploads', 'audio');
const IMAGE_DIR = join(process.cwd(), 'uploads', 'images');

const audioStorage = diskStorage({
  destination: (_req, _file, cb) => cb(null, AUDIO_DIR),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + extname(file.originalname) || '.mp3');
  },
});

const imageStorage = diskStorage({
  destination: (_req, _file, cb) => cb(null, IMAGE_DIR),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + extname(file.originalname) || '.jpg');
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

@Controller('upload')
export class UploadController {
  @Post('audio')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SINGER', 'ADMIN')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: audioStorage,
      fileFilter: audioFilter,
      limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    }),
  )
  uploadAudio(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No audio file provided');
    const baseUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 3001}`;
    return { url: `${baseUrl}/uploads/audio/${file.filename}` };
  }

  @Post('image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SINGER', 'ADMIN')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: imageStorage,
      fileFilter: imageFilter,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No image file provided');
    const baseUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 3001}`;
    return { url: `${baseUrl}/uploads/images/${file.filename}` };
  }
}
