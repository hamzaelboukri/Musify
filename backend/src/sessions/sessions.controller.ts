import { Controller, Get, UseGuards } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  @Get('me')
  getMySessions(@CurrentUser('_id') userId: string) {
    return this.sessionsService.getSessionsByUser(userId);
  }

  @Get('active')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  getAllActiveSessions() {
    return this.sessionsService.getAllActiveSessions();
  }
}
