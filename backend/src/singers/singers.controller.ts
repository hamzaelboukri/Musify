import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SingersService } from './singers.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateSongDto } from '../songs/dto/create-song.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('singers')
export class SingersController {
  constructor(private singersService: SingersService) {}

  @Post('apply')
  @UseGuards(JwtAuthGuard)
  apply(
    @CurrentUser('_id') userId: string,
    @Body() body: { stageName: string; bio?: string },
  ) {
    return this.singersService.apply(userId, body);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SINGER', 'ADMIN')
  getMyProfile(@CurrentUser('_id') userId: string) {
    return this.singersService.getProfileByUserId(userId);
  }

  @Public()
  @Get()
  getAllApproved() {
    return this.singersService.getAllApproved();
  }

  @Public()
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.singersService.getProfileById(id);
  }

  @Post('songs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SINGER')
  uploadSong(@CurrentUser('_id') userId: string, @Body() dto: CreateSongDto) {
    return this.singersService.uploadSong(userId, dto);
  }

  @Get('songs/me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SINGER')
  getMySongs(@CurrentUser('_id') userId: string) {
    return this.singersService.getMySongs(userId);
  }

  @Patch('songs/:songId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SINGER')
  updateSong(
    @Param('songId') songId: string,
    @CurrentUser('_id') userId: string,
    @Body() body: Partial<CreateSongDto>,
  ) {
    return this.singersService.updateSong(songId, userId, body);
  }

  @Delete('songs/:songId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SINGER')
  deleteSong(@Param('songId') songId: string, @CurrentUser('_id') userId: string) {
    return this.singersService.deleteSong(songId, userId);
  }

  @Get('stats/me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SINGER')
  getStatistics(@CurrentUser('_id') userId: string) {
    return this.singersService.getStatistics(userId);
  }
}
