import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AuthGuard } from 'src/auth/auth.guard';
import { LoggedUser } from 'src/decorators/auth/LoggedUser.decorator';
import { GetMeUserDto } from 'src/dto/User/Me/Get.dto';
import { LoggedUserType } from 'src/types/auth/LoggedUser.type';

import { MeUserService } from './me-user.service';

@UseGuards(AuthGuard)
@Controller('me')
export class MeUserController {
  constructor(private readonly meUserService: MeUserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  async getMe(@LoggedUser() loggedUser: LoggedUserType) {
    const user = await this.meUserService.getMe(loggedUser);

    return plainToInstance(GetMeUserDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
