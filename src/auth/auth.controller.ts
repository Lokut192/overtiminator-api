import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from 'src/dto/User/Create.dto';
import { GetOneUserDto } from 'src/dto/User/GetOne.dto';
import { SignInUserDto } from 'src/dto/User/SignIn.dto';

import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiBody({
    type: CreateUserDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User already exists',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Your new user',
    schema: { type: 'object' },
    type: GetOneUserDto,
  })
  async signUp(@Body() user: CreateUserDto) {
    const createdUser = await this.authService.registerUser(user);

    return plainToInstance(GetOneUserDto, createdUser);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiBody({ required: true, type: SignInUserDto, schema: { type: 'object' } })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No matching credentials found',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Your bearer token',
    schema: { type: 'object' },
    example: { bearer: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' },
  })
  async signIn(@Body() signInUser: SignInUserDto) {
    return this.authService.signUserIn(signInUser);
    // const createdUser = await this.authService.registerUser(user);
    // return plainToInstance(GetOneUserDto, createdUser);
  }
}
