import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionService } from './questions.service';
import { Question, QuestionSchema } from './schemas/questions.schema';
import { QuestionController } from './questions.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
    ]),
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService], // 👈 важливо! щоб інші модулі могли його використати
})
export class QuestionsModule {}
