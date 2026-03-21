import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';
import { Public } from '../common/decorators/public.decorator';

const UPLOADS_ROOT = join(process.cwd(), 'uploads');

/**
 * Serves uploaded files (images, audio) via API route.
 * Public - no auth required for cover/audio playback.
 */
@Controller('uploads')
@Public()
export class UploadsServeController {
  @Get('images/:filename')
  serveImage(@Param('filename') filename: string, @Res() res: Response): void {
    const safe = filename.replace(/\.\./g, '').replace(/[\/\\]/g, '');
    const imagesDir = join(UPLOADS_ROOT, 'images');
    if (!existsSync(join(imagesDir, safe))) {
      throw new NotFoundException('Image not found');
    }
    res.sendFile(safe, { root: imagesDir }, (err) => {
      if (err && !res.headersSent) res.status(500).json({ message: 'Error serving file' });
    });
  }

  @Get('audio/:filename')
  serveAudio(@Param('filename') filename: string, @Res() res: Response): void {
    const safe = filename.replace(/\.\./g, '').replace(/[\/\\]/g, '');
    const audioDir = join(UPLOADS_ROOT, 'audio');
    if (!existsSync(join(audioDir, safe))) {
      throw new NotFoundException('Audio not found');
    }
    res.sendFile(safe, { root: audioDir }, (err) => {
      if (err && !res.headersSent) res.status(500).json({ message: 'Error serving file' });
    });
  }
}
