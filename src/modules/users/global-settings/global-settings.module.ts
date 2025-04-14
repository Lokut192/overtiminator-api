import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalUserSetting } from 'src/entities/User/GlobalUserSetting.entity';

import { GlobalSettingsController } from './global-settings.controller';
import { GlobalSettingsService } from './global-settings.service';

@Module({
  imports: [TypeOrmModule.forFeature([GlobalUserSetting])],
  exports: [GlobalSettingsService],
  providers: [GlobalSettingsService],
  controllers: [GlobalSettingsController],
})
export class GlobalSettingsModule {}
