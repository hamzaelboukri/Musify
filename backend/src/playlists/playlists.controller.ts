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
import { PlaylistsService } from './playlists.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('playlists')
@UseGuards(JwtAuthGuard)
export class PlaylistsController {
  constructor(private playlistsService: PlaylistsService) {}

  @Post()
  create(@CurrentUser('_id') userId: string, @Body('name') name: string) {
    return this.playlistsService.create(userId, name);
  }

  @Get()
  findByUser(@CurrentUser('_id') userId: string) {
    return this.playlistsService.findByUser(userId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.playlistsService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser('_id') userId: string,
    @Body('name') name: string,
  ) {
    return this.playlistsService.update(id, userId, name);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser('_id') userId: string) {
    return this.playlistsService.delete(id, userId);
  }

  @Post(':id/songs/:songId')
  addSong(
    @Param('id') id: string,
    @Param('songId') songId: string,
    @CurrentUser('_id') userId: string,
  ) {
    return this.playlistsService.addSong(id, userId, songId);
  }

  @Delete(':id/songs/:songId')
  removeSong(
    @Param('id') id: string,
    @Param('songId') songId: string,
    @CurrentUser('_id') userId: string,
  ) {
    return this.playlistsService.removeSong(id, userId, songId);
  }
}
