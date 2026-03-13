import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('albums')
export class AlbumsController {
  constructor(private albumsService: AlbumsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SINGER', 'ADMIN')
  create(
    @CurrentUser('_id') userId: string,
    @Body() body: { name: string; coverImage?: string },
  ) {
    return this.albumsService.create(userId, body);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SINGER', 'ADMIN')
  getMyAlbums(@CurrentUser('_id') userId: string) {
    return this.albumsService.getMyAlbums(userId);
  }

  @Post(':albumId/songs/:songId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SINGER', 'ADMIN')
  addSong(
    @Param('albumId') albumId: string,
    @Param('songId') songId: string,
    @CurrentUser('_id') userId: string,
  ) {
    return this.albumsService.addSongToAlbum(albumId, songId, userId);
  }

  @Delete(':albumId/songs/:songId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SINGER', 'ADMIN')
  removeSong(
    @Param('albumId') albumId: string,
    @Param('songId') songId: string,
    @CurrentUser('_id') userId: string,
  ) {
    return this.albumsService.removeSongFromAlbum(albumId, songId, userId);
  }

  @Delete(':albumId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SINGER', 'ADMIN')
  deleteAlbum(@Param('albumId') albumId: string, @CurrentUser('_id') userId: string) {
    return this.albumsService.deleteAlbum(albumId, userId);
  }

  @Public()
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.albumsService.getById(id);
  }
}
