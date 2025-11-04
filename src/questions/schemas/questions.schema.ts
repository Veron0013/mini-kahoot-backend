import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  LanguageEnum,
  QuestionTagsEnum,
} from '../../common/types/common.types';

export type QuestionDocument = Question & Document;

@Schema({ timestamps: true })
export class Question {
  @Prop({ required: true, unique: true })
  name: string; // унікальний ключ, наприклад "js_scope_let"

  @Prop({ required: true, min: 1, max: 5 })
  difficulty: number;

  @Prop({ required: true, min: 0, max: 10 })
  bonus: number;

  @Prop({
    type: Map,
    of: {
      question: String,
      options: [String],
    },
  })
  translations: Record<
    LanguageEnum,
    {
      question: string;
      options: string[];
    }
  >;

  @Prop({ required: true })
  correctIndex: number;

  @Prop({ required: true })
  questionDelay: number;

  @Prop({ required: true })
  answerDelay: number;

  @Prop({ type: [String], enum: Object.values(QuestionTagsEnum) })
  tags: QuestionTagsEnum[];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
