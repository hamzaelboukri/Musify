import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PlaylistDocument = Playlist & Document;

@Schema({ timestamps: true })
export class Playlist {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Song', default: [] })
  songs: Types.ObjectId[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);
