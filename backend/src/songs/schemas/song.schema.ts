import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SongDocument = Song & Document;

@Schema({ timestamps: true })
export class Song {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  artist: string;

  @Prop({ type: Types.ObjectId, ref: 'SingerProfile', required: true })
  singerId: Types.ObjectId;

  @Prop({ default: '' })
  album: string;

  @Prop({ type: Types.ObjectId, ref: 'Album', default: null })
  albumId: Types.ObjectId | null;

  @Prop({ default: '' })
  genre: string;

  @Prop({ default: '' })
  coverImage: string;

  @Prop({ required: true })
  audioUrl: string;

  @Prop({ required: true })
  duration: number;

  @Prop({ default: 0 })
  playCount: number;

  @Prop({ default: false })
  isApproved: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const SongSchema = SchemaFactory.createForClass(Song);

// Indexes for fast queries with 1M+ songs
SongSchema.index({ isApproved: 1, genre: 1, playCount: -1, createdAt: -1 });
SongSchema.index({ isApproved: 1, singerId: 1, createdAt: -1 });
SongSchema.index({ isApproved: 1, createdAt: -1 });
SongSchema.index({ isApproved: 1, artist: 1 });
