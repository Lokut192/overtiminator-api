import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';

import { MeUserController } from './me-user.controller';
import { MeUserService } from './me-user.service';

@Module({
  imports: [UserModule],
  providers: [MeUserService],
  controllers: [MeUserController],
})
export class MeUserModule {}
