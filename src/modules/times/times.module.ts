import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Time } from 'src/entities/Time/Time.entity';

import { TimesController } from './times.controller';
import { TimesService } from './times.service';

@Module({
  imports: [TypeOrmModule.forFeature([Time])],
  exports: [TimesService],
  providers: [TimesService],
  controllers: [TimesController],
})
export class TimesModule {}
