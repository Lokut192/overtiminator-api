import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeStatistic } from 'src/entities/Time/Statistics/TimesStatistic.entity';
import { Time } from 'src/entities/Time/Time.entity';
import { User } from 'src/entities/User/User.entity';

import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { TasksStatisticsService } from './tasks-statistics.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TimeStatistic, Time, User]),
    // forwardRef(() => TimesModule),
  ],
  providers: [StatisticsService, TasksStatisticsService],
  controllers: [StatisticsController],
})
export class StatisticsModule {}
