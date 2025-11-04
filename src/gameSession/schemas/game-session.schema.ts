import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GameSessionDocument = GameSession & Document;

interface Answer {
  questionId: Types.ObjectId; // посилання на питання
  answerTime: number; // час відповіді
  count: number; // бали за це питання
  streak: number; // ланцюг правильних відповідей
  isCorrect: boolean; // правильна відповідь чи ні
}

@Schema({ timestamps: true })
export class GameSession {
  @Prop({ required: true, ref: 'user' })
  userId: Types.ObjectId; // користувач

  @Prop({
    type: [
      {
        questionId: { type: Types.ObjectId, ref: 'question', required: true },
        answerTime: { type: Number, required: true },
        isCorrect: { type: Boolean, required: true },
        count: { type: Number, required: true, default: 0 },
        streak: { type: Number, required: true, default: 0 },
      },
    ],
    default: [],
  })
  answers: Answer[]; // масив відповідей у сесії

  @Prop({ default: 0 })
  totalScore: number; // поточний загальний рахунок сесії
}

export const GameSessionSchema = SchemaFactory.createForClass(GameSession);
