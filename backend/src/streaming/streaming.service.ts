import { Injectable, ConflictException } from '@nestjs/common';
import { SessionsService } from '../sessions/sessions.service';
import { SongsService } from '../songs/songs.service';
import { StatsService } from '../stats/stats.service';

export type StreamAction = 'stop_previous' | 'block_new';

@Injectable()
export class StreamingService {
  constructor(
    private sessionsService: SessionsService,
    private songsService: SongsService,
    private statsService: StatsService,
  ) {}

  async startStreaming(userId: string, deviceId: string, accessToken: string, action: StreamAction = 'stop_previous') {
    const check = await this.sessionsService.isDeviceAllowed(userId, deviceId);
    if (!check.allowed) {
      if (action === 'block_new') {
        throw new ConflictException(check.message);
      }
      await this.sessionsService.deactivateOtherSessions(userId, deviceId);
    }
    return this.sessionsService.create(userId, deviceId, accessToken);
  }

  async stopStreaming(userId: string, deviceId?: string) {
    return this.sessionsService.stopSession(userId, deviceId);
  }

  async checkSession(userId: string, deviceId: string) {
    return this.sessionsService.isDeviceAllowed(userId, deviceId);
  }

  async recordPlay(userId: string, songId: string, deviceId: string) {
    const check = await this.sessionsService.isDeviceAllowed(userId, deviceId);
    if (!check.allowed) {
      throw new ConflictException(check.message);
    }
    await this.sessionsService.updateActivity(userId, deviceId);
    await this.songsService.incrementPlayCount(songId);
    await this.statsService.recordListen(userId, songId);
    return { success: true };
  }
}
