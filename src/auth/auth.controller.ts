import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from 'src/dto/User/Create.dto';
import { GetOneUserDto } from 'src/dto/User/GetOne.dto';
import { SignInUserDto } from 'src/dto/User/SignIn.dto';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async signUp(@Body() user: CreateUserDto) {
    const createdUser = await this.authService.registerUser(user);

    return plainToInstance(GetOneUserDto, createdUser);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async signIn(@Body() signInUser: SignInUserDto) {
    return this.authService.signUserIn(signInUser);
    // const createdUser = await this.authService.registerUser(user);
    // return plainToInstance(GetOneUserDto, createdUser);
  }
}
