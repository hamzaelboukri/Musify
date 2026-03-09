import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { ListeningHistory, ListeningHistorySchema } from './schemas/listening-history.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ListeningHistory.name, schema: ListeningHistorySchema }]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}
