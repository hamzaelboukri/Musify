import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AlbumDocument = Album & Document;

@Schema({ timestamps: true })
export class Album {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  artist: string;

  @Prop({ type: Types.ObjectId, ref: 'SingerProfile', required: true })
  singerId: Types.ObjectId;

  @Prop({ default: '' })
  coverImage: string;

  @Prop({ type: [Types.ObjectId], ref: 'Song', default: [] })
  songs: Types.ObjectId[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
