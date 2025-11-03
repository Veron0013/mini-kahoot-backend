import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { LanguageEnum } from 'src/common/types/common.types';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop()
  avatarUrl?: string;

  @Prop({ default: 'en' })
  language?: LanguageEnum;

  @Prop({ default: 'light' })
  theme?: 'light' | 'dark';
}

export const UserSchema = SchemaFactory.createForClass(User);
