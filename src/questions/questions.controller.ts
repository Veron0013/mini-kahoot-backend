import { Controller, Get, Param, Query } from '@nestjs/common';
import { QuestionService } from './questions.service';
import { GetQuestionsDto } from './dto/get-questions.dto';

@Controller('api/questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.questionService.findById(id);
  }

  @Get()
  getQuestions(@Query() dto: GetQuestionsDto) {
    return this.questionService.getQuestionsByFilter(dto);
  }
}
