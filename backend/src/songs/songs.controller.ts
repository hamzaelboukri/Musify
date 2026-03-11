import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SongsService } from './songs.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '../users/schemas/user.schema';

@Controller('songs')
export class SongsController {
  constructor(private songsService: SongsService) {}

  @Public()
  @Get()
  findAll(
    @Query('genre') genre?: string,
    @Query('artist') artist?: string,
    @Query('album') album?: string,
    @Query('search') search?: string,
    @Query('skip') skip?: string,
    @Query('limit') limit?: string,
  ) {
    return this.songsService.findAll(
      { genre, artist, album, search },
      parseInt(skip || '0'),
      parseInt(limit || '20'),
    );
  }

  @Public()
  @Get('trending')
  getTrending(@Query('limit') limit?: string) {
    return this.songsService.getTrending(parseInt(limit || '10'));
  }

  @Public()
  @Get('new-releases')
  getNewReleases(@Query('limit') limit?: string) {
    return this.songsService.getNewReleases(parseInt(limit || '10'));
  }

  @Public()
  @Get('stats')
  getPlatformStats() {
    return this.songsService.getPlatformStats();
  }

  @Public()
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.songsService.findById(id);
  }

  @Get('singer/:singerId')
  @UseGuards(JwtAuthGuard)
  findBySinger(@Param('singerId') singerId: string) {
    return this.songsService.findBySinger(singerId);
  }
}
