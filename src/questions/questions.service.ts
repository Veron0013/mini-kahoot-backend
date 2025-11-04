import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Question, QuestionDocument } from './schemas/questions.schema';
import { LanguageEnum } from '../common/types/common.types';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
  ) {}

  async getQuestionsByFilter(filters: {
    difficulty?: number;
    tags?: string[];
    limit?: number;
    lang?: string;
  }) {
    const query: FilterQuery<QuestionDocument> = {};

    if (filters.difficulty) query.difficulty = filters.difficulty;
    if (filters.tags?.length) query.tags = { $in: filters.tags };

    const questions = await this.questionModel
      .find(query)
      .limit(filters.limit ?? 10)
      .exec();

    if (
      filters.lang &&
      Object.values(LanguageEnum).includes(filters.lang as LanguageEnum)
    ) {
      const lang = filters.lang as LanguageEnum;

      return questions.map((q) => ({
        ...q.toObject(),
        translation: q.translations?.[lang],
      }));
    }

    return questions;
  }

  async findById(questionId: string) {
    const question = await this.questionModel.findById(questionId).exec();
    if (!question) throw new NotFoundException('Question not found');
    return question;
  }
}
