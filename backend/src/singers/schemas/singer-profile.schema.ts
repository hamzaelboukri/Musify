import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SingerProfileDocument = SingerProfile & Document;

@Schema({ timestamps: true })
export class SingerProfile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  stageName: string;

  @Prop({ default: '' })
  bio: string;

  @Prop({ default: '' })
  image: string;

  @Prop({ default: false })
  isApproved: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const SingerProfileSchema = SchemaFactory.createForClass(SingerProfile);
