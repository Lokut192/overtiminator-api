import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { LoggedUser } from 'src/decorators/auth/LoggedUser.decorator';
import { CreateOneTimeDto } from 'src/dto/Times/Times/CreateOne.dto';
import { GetOneTimeDto } from 'src/dto/Times/Times/GetOne';

import { AuthGuard } from '../auth/auth.guard';
import { LoggedUserType } from '../auth/auth.types';
import { TimesService } from './times.service';

@Controller('times')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Times')
export class TimesController {
  constructor(private readonly timesService: TimesService) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Create one time for current logged user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The created time',
    type: GetOneTimeDto,
    isArray: false,
  })
  async findMany(@LoggedUser() loggedUser: LoggedUserType) {
    const times = await this.timesService.findMany(loggedUser.userId);

    return plainToInstance(GetOneTimeDto, times);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Create one time for current logged user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The created time',
    type: GetOneTimeDto,
    isArray: false,
  })
  async createOne(
    @LoggedUser() loggedUser: LoggedUserType,
    @Body() createTimeDto: CreateOneTimeDto,
  ) {
    const time = await this.timesService.createOne(
      plainToInstance(CreateOneTimeDto, createTimeDto),
      loggedUser.userId,
    );

    return plainToInstance(GetOneTimeDto, time);
  }

  @Delete('id/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Delete one time by its id' })
  @ApiParam({ name: 'id', description: 'The time id', type: 'number' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The time has been successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Time with the provided does not exist',
  })
  async deleteOne(
    @Param('id', new ParseIntPipe()) strId: number,
    @LoggedUser() loggedUser: LoggedUserType,
  ) {
    const timeId = Number(strId);

    if (timeId <= 0) {
      throw new BadRequestException('Invalid time id');
    }

    await this.timesService.deleteOne(timeId, loggedUser.userId);

    return;
  }
}
