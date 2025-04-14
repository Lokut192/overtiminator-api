import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/User/User.entity';

import { GlobalSettingsModule } from './global-settings/global-settings.module';
import { MeModule } from './me/me.module';
import { SettingsModule } from './settings/settings.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => SettingsModule),
    forwardRef(() => MeModule),
    GlobalSettingsModule,
  ],
  exports: [UsersService, SettingsModule, GlobalSettingsModule, MeModule],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
