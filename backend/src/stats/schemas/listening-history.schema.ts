import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ListeningHistoryDocument = ListeningHistory & Document;

@Schema({ timestamps: true })
export class ListeningHistory {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Song', required: true })
  songId: Types.ObjectId;

  @Prop({ default: Date.now })
  playedAt: Date;
}

export const ListeningHistorySchema = SchemaFactory.createForClass(ListeningHistory);
