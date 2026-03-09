import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('stats')
  getPlatformStats() {
    return this.adminService.getPlatformStats();
  }

  @Get('users')
  getUsers(@Query('skip') skip?: string, @Query('limit') limit?: string) {
    return this.adminService.getUsers(parseInt(skip || '0'), parseInt(limit || '20'));
  }

  @Post('users/:userId/ban')
  banUser(@Param('userId') userId: string) {
    return this.adminService.banUser(userId);
  }

  @Post('users/:userId/unban')
  unbanUser(@Param('userId') userId: string) {
    return this.adminService.unbanUser(userId);
  }

  @Get('singers/pending')
  getPendingSingers() {
    return this.adminService.getPendingSingers();
  }

  @Post('singers/:singerId/approve')
  approveSinger(@Param('singerId') singerId: string) {
    return this.adminService.approveSinger(singerId);
  }

  @Post('singers/:singerId/reject')
  rejectSinger(@Param('singerId') singerId: string) {
    return this.adminService.rejectSinger(singerId);
  }

  @Get('songs/pending')
  getPendingSongs() {
    return this.adminService.getPendingSongs();
  }

  @Post('songs/:songId/approve')
  approveSong(@Param('songId') songId: string) {
    return this.adminService.approveSong(songId);
  }

  @Delete('songs/:songId')
  deleteSong(@Param('songId') songId: string) {
    return this.adminService.deleteSong(songId);
  }

  @Get('sessions')
  getActiveSessions() {
    return this.adminService.getActiveSessions();
  }
}
