import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  avatar?: string;

  @Prop()
  bio?: string;

  @Prop()
  phone?: string;

  @Prop()
  dateOfBirth?: Date;

  @Prop({ enum: ['male', 'female', 'other', 'prefer-not-to-say'] })
  gender?: string;

  @Prop()
  occupation?: string;

  @Prop()
  company?: string;

  @Prop()
  website?: string;

  @Prop({ type: [String], default: [] })
  interests?: string[];

  @Prop({ type: Object })
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };

  @Prop()
  coverPhoto?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isOnline: boolean;

  @Prop()
  lastSeen?: Date;

  @Prop({ type: Object })
  location?: {
    latitude: number;
    longitude: number;
    updatedAt: Date;
  };

  @Prop({ default: false })
  profileCompleted?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
