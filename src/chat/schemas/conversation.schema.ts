import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ConversationDocument = Conversation & Document;

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: true })
  participants: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Message' })
  lastMessage?: Types.ObjectId;

  @Prop({ type: Map, of: Number, default: {} })
  unreadCount: Map<string, number>;

  @Prop({ default: false })
  isGroup: boolean;

  @Prop()
  groupName?: string;

  @Prop()
  groupAvatar?: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
