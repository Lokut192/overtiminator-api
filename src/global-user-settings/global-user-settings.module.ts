import { Module } from '@nestjs/common';
import { GlobalUserSettingsService } from './global-user-settings.service';

@Module({
  providers: [GlobalUserSettingsService]
})
export class GlobalUserSettingsModule {}
