import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    //MongooseModule.forRoot(process.env.MONGO_URL),
    //UsersModule,
    //QuestionsModule,
    //LeaderboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
