import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSetting } from 'src/entities/User/UserSetting.entity';
import { GlobalUserSettingsModule } from 'src/global-user-settings/global-user-settings.module';

import { UserModule } from '../user.module';
import { UserSettingsService } from './user-settings.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSetting]),
    GlobalUserSettingsModule,
    forwardRef(() => UserModule),
  ],
  exports: [UserSettingsService],
  providers: [UserSettingsService],
})
export class UserSettingsModule {}
