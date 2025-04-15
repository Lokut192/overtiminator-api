import {
  BadRequestException,
  Controller,
  Get,
  GoneException,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExcludeController,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { GetOneUserDto } from 'src/dto/User/GetOne.dto';

import { AuthGuard } from '../auth/auth.guard';
import { UsersService } from './users.service';

@UseGuards(AuthGuard)
@Controller('users')
@ApiBearerAuth()
@ApiTags('Users')
@ApiExcludeController(process.env.NODE_ENV === 'production')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Get one user' })
  @ApiParam({
    name: 'id',
    schema: { type: 'number' },
    description: 'The user id',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user',
    type: GetOneUserDto,
    isArray: false,
  })
  async findOne(@Param('id', new ParseIntPipe()) strId: string) {
    if (process.env.NODE_ENV !== 'development') {
      throw new GoneException('Endpoint not available in production yet.');
    }

    // Check if the id is a valid number
    if (Number(strId) <= 0) {
      throw new BadRequestException('Invalid user id.');
    }

    const id = parseInt(strId, 10);

    const user = await this.usersService.findOne(id);

    return plainToInstance(GetOneUserDto, user);
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Get many users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A list of users',
    type: GetOneUserDto,
    isArray: true,
  })
  async findMany() {
    if (process.env.NODE_ENV !== 'development') {
      throw new GoneException('Endpoint not available in production yet.');
    }
    const users = await this.usersService.findMany();

    return plainToInstance(GetOneUserDto, users);
  }
}
