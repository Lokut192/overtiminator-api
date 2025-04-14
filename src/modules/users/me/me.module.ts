import { forwardRef, Module } from '@nestjs/common';

import { UsersModule } from '../users.module';
import { MeController } from './me.controller';
import { MeService } from './me.service';

@Module({
  imports: [forwardRef(() => UsersModule)],
  exports: [MeService],
  providers: [MeService],
  controllers: [MeController],
})
export class MeModule {}
