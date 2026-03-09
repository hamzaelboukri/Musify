import { Controller, Get, Param, Post, Delete, UseGuards } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  getFavorites(@CurrentUser('_id') userId: string) {
    return this.favoritesService.getFavorites(userId);
  }

  @Post(':songId')
  addFavorite(@CurrentUser('_id') userId: string, @Param('songId') songId: string) {
    return this.favoritesService.addFavorite(userId, songId);
  }

  @Delete(':songId')
  removeFavorite(@CurrentUser('_id') userId: string, @Param('songId') songId: string) {
    return this.favoritesService.removeFavorite(userId, songId);
  }

  @Get('check/:songId')
  checkFavorite(@CurrentUser('_id') userId: string, @Param('songId') songId: string) {
    return this.favoritesService.isFavorite(userId, songId);
  }
}
