import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema({ timestamps: true })
export class Session {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: true })
  token: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  lastActivity: Date;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
