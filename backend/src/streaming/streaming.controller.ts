import { Body, Controller, Post, Delete, UseGuards } from '@nestjs/common';
import { StreamingService } from './streaming.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('streaming')
@UseGuards(JwtAuthGuard)
export class StreamingController {
  constructor(private streamingService: StreamingService) {}

  @Post('start')
  startStreaming(
    @CurrentUser('_id') userId: string,
    @Body() body: { deviceId: string; accessToken: string; action?: 'stop_previous' | 'block_new' },
  ) {
    return this.streamingService.startStreaming(
      userId,
      body.deviceId,
      body.accessToken,
      body.action || 'stop_previous',
    );
  }

  @Delete('stop')
  stopStreaming(
    @CurrentUser('_id') userId: string,
    @Body() body?: { deviceId?: string },
  ) {
    return this.streamingService.stopStreaming(userId, body?.deviceId);
  }

  @Post('check')
  checkSession(
    @CurrentUser('_id') userId: string,
    @Body() body: { deviceId: string },
  ) {
    return this.streamingService.checkSession(userId, body.deviceId);
  }

  @Post('play')
  recordPlay(
    @CurrentUser('_id') userId: string,
    @Body() body: { songId: string; deviceId: string },
  ) {
    return this.streamingService.recordPlay(userId, body.songId, body.deviceId);
  }
}
