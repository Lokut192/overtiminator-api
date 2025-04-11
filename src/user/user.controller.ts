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
import {
  ApiBearerAuth,
  ApiExcludeController,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetOneUserDto } from 'src/dto/User/GetOne.dto';

import { UserService } from './user.service';

@UseGuards(AuthGuard)
@Controller('user')
@ApiBearerAuth()
@ApiTags('user')
@ApiExcludeController(process.env.NODE_ENV === 'production')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
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
    const users = await this.userService.findMany();

    return plainToInstance(GetOneUserDto, users);
  }
}
