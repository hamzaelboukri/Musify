import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class FavoritesService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getFavorites(userId: string) {
    const user = await this.userModel.findById(userId).populate('favorites').lean();
    return user?.favorites || [];
  }

  async addFavorite(userId: string, songId: string) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: new Types.ObjectId(songId) } },
      { new: true },
    );
  }

  async removeFavorite(userId: string, songId: string) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $pull: { favorites: new Types.ObjectId(songId) } },
      { new: true },
    );
  }

  async isFavorite(userId: string, songId: string) {
    const user = await this.userModel.findById(userId);
    return user?.favorites.some((id) => id.equals(new Types.ObjectId(songId))) ?? false;
  }
}
