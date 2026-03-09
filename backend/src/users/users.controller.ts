import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async getProfile(@CurrentUser('_id') userId: string) {
    const user = await this.usersService.findById(userId);
    const { password, refreshToken, ...profile } = user.toObject();
    return { ...profile, id: profile._id?.toString() };
  }

  @Patch('me')
  updateProfile(@CurrentUser('_id') userId: string, @Body() body: { name?: string }) {
    return this.usersService.updateProfile(userId, body);
  }

  @Post('follow/:singerId')
  followSinger(@CurrentUser('_id') userId: string, @Param('singerId') singerId: string) {
    return this.usersService.followSinger(userId, singerId);
  }

  @Post('unfollow/:singerId')
  unfollowSinger(@CurrentUser('_id') userId: string, @Param('singerId') singerId: string) {
    return this.usersService.unfollowSinger(userId, singerId);
  }
}
