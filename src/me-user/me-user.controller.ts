import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AuthGuard } from 'src/auth/auth.guard';
import { LoggedUser } from 'src/decorators/auth/LoggedUser.decorator';
import { GetMeUserDto } from 'src/dto/User/Me/Get.dto';
import { LoggedUserType } from 'src/types/auth/LoggedUser.type';

import { MeUserService } from './me-user.service';

@UseGuards(AuthGuard)
@Controller('me')
@ApiBearerAuth()
export class MeUserController {
  constructor(private readonly meUserService: MeUserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @ApiOperation({
    summary: 'Get current logged in user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get current logged in user',
    type: GetMeUserDto,
  })
  async getMe(@LoggedUser() loggedUser: LoggedUserType) {
    const user = await this.meUserService.getMe(loggedUser);

    return plainToInstance(GetMeUserDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
