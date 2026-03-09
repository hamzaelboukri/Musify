import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('stats')
@UseGuards(JwtAuthGuard)
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get('history')
  getListeningHistory(
    @CurrentUser('_id') userId: string,
    @Query('limit') limit?: string,
  ) {
    return this.statsService.getListeningHistory(userId, parseInt(limit || '50'));
  }
}
