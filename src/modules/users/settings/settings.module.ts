import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSetting } from 'src/entities/User/UserSetting.entity';

import { GlobalSettingsModule } from '../global-settings/global-settings.module';
import { UsersModule } from '../users.module';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSetting]),
    GlobalSettingsModule,
    forwardRef(() => UsersModule),
  ],
  providers: [SettingsService],
  controllers: [SettingsController],
})
export class SettingsModule {}
