import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalUserSetting } from 'src/entities/User/GlobalUserSetting.entity';

import { GlobalUserSettingsController } from './global-user-settings.controller';
import { GlobalUserSettingsService } from './global-user-settings.service';

@Module({
  imports: [TypeOrmModule.forFeature([GlobalUserSetting])],
  exports: [GlobalUserSettingsService],
  providers: [GlobalUserSettingsService],
  controllers: [GlobalUserSettingsController],
})
export class GlobalUserSettingsModule {}
