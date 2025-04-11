import {
  Controller,
  Get,
  GoneException,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetOneUserDto } from 'src/dto/User/GetOne.dto';

import { UserService } from './user.service';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async findOne(@Param('id') strId: string) {
    if (process.env.NODE_ENV !== 'development') {
      throw new GoneException('Endpoint not available in production yet.');
    }
    const id = parseInt(strId, 10);
    const user = await this.userService.findOne(id);

    return plainToInstance(GetOneUserDto, user);
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async findMany() {
    if (process.env.NODE_ENV !== 'development') {
      throw new GoneException('Endpoint not available in production yet.');
    }
    const users = await this.userService.findMany();

    return plainToInstance(GetOneUserDto, users);
  }
}
