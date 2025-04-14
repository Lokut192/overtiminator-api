import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { LoggedUser } from 'src/decorators/auth/LoggedUser.decorator';
import { GetMeUserDto } from 'src/dto/User/Me/Get.dto';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { LoggedUserType } from 'src/modules/auth/auth.types';

import { MeService } from './me.service';

@UseGuards(AuthGuard)
@Controller('users/me')
@ApiBearerAuth()
@ApiTags('Me')
export class MeController {
  constructor(private readonly meService: MeService) {}

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
    const user = await this.meService.getMe(loggedUser);

    return plainToInstance(GetMeUserDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
