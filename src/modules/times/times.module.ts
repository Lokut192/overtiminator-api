import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Time } from 'src/entities/Time/Time.entity';

import { StatisticsModule } from './statistics/statistics.module';
import { TimesController } from './times.controller';
import { TimesService } from './times.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Time]),
    forwardRef(() => StatisticsModule),
  ],
  exports: [TimesService, StatisticsModule],
  providers: [TimesService],
  controllers: [TimesController],
})
export class TimesModule {}
