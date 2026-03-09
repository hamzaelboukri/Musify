import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  USER = 'USER',
  SINGER = 'SINGER',
  ADMIN = 'ADMIN',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ type: [Types.ObjectId], ref: 'Song', default: [] })
  favorites: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'SingerProfile', default: [] })
  following: Types.ObjectId[];

  @Prop({ default: false })
  isBanned: boolean;

  @Prop()
  refreshToken?: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
