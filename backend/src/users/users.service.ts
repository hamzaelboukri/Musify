import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(data: Partial<User>) {
    const user = new this.userModel(data);
    return user.save();
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async setRefreshToken(userId: string, refreshToken: string) {
    return this.userModel.findByIdAndUpdate(userId, { refreshToken });
  }

  async clearRefreshToken(userId: string) {
    return this.userModel.findByIdAndUpdate(userId, { refreshToken: null });
  }

  async updateProfile(userId: string, data: Partial<User>) {
    const { password, refreshToken, ...updateData } = data as any;
    if (updateData.email) {
      const existing = await this.userModel.findOne({ email: updateData.email });
      if (existing && existing._id.toString() !== userId) {
        throw new ConflictException('Email already in use');
      }
    }
    const updated = await this.userModel.findByIdAndUpdate(userId, updateData, { new: true }).select('-password -refreshToken');
    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }

  async followSinger(userId: string, singerId: string) {
    const user = await this.findById(userId);
    const singerObjId = new Types.ObjectId(singerId);
    if (user.following.some((id) => id.equals(singerObjId))) {
      return user;
    }
    return this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { following: singerObjId } },
      { new: true },
    );
  }

  async unfollowSinger(userId: string, singerId: string) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $pull: { following: new Types.ObjectId(singerId) } },
      { new: true },
    );
  }

  async findAll(skip = 0, limit = 20) {
    return this.userModel
      .find()
      .select('-password -refreshToken')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();
  }

  async banUser(userId: string, currentUserId?: string) {
    if (currentUserId && userId === currentUserId) {
      throw new BadRequestException('You cannot ban yourself');
    }
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return this.userModel.findByIdAndUpdate(userId, { isBanned: true }, { new: true })
      .select('-password -refreshToken')
      .lean();
  }

  async unbanUser(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return this.userModel.findByIdAndUpdate(userId, { isBanned: false }, { new: true })
      .select('-password -refreshToken')
      .lean();
  }
}
