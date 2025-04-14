import {
  Body,
  Controller,
  Get,
  GoneException,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExcludeController,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { CreateGlobalUserSettingDto } from 'src/dto/User/UserSetting/Global/Create.dto';
import { GetGlobalUserSettingDto } from 'src/dto/User/UserSetting/Global/Get.dto';
import { UpdateGlobalUserSettingDto } from 'src/dto/User/UserSetting/Global/Update.dto';

import { GlobalSettingsService } from './global-settings.service';

@Controller('users/global-settings')
@ApiExcludeController(process.env.NODE_ENV === 'production')
@ApiTags('GlobalUsersSettings')
export class GlobalSettingsController {
  constructor(private readonly settingsService: GlobalSettingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Create a global user setting' })
  @ApiBody({ type: CreateGlobalUserSettingDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: GetGlobalUserSettingDto,
    description: 'The created setting',
    isArray: false,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Setting already exists.',
  })
  async createOne(@Body() settingToCreate: CreateGlobalUserSettingDto) {
    if (process.env.NODE_ENV !== 'development') {
      throw new GoneException('Endpoint not available in production yet.');
    }

    const setting = await this.settingsService.createOne(settingToCreate);

    return plainToInstance(GetGlobalUserSettingDto, setting, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Get all global user settings' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetGlobalUserSettingDto,
    description: 'A list of global user settings',
    isArray: true,
  })
  async findMany() {
    if (process.env.NODE_ENV !== 'development') {
      throw new GoneException('Endpoint not available in production yet.');
    }

    const settings = await this.settingsService.findMany();

    return plainToInstance(GetGlobalUserSettingDto, settings, {
      excludeExtraneousValues: true,
    });
  }

  @Put(':code')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Update a global user settings' })
  @ApiParam({
    name: 'code',
    schema: { type: 'string' },
    description: 'The global setting code',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetGlobalUserSettingDto,
    description: 'The edited setting',
    isArray: false,
  })
  async updateOne(
    @Param('code') code: string,
    @Body() settingToUpdate: UpdateGlobalUserSettingDto,
  ) {
    if (process.env.NODE_ENV !== 'development') {
      throw new GoneException('Endpoint not available in production yet.');
    }

    const setting = await this.settingsService.updateOne(code, settingToUpdate);

    return plainToInstance(GetGlobalUserSettingDto, setting, {
      excludeExtraneousValues: true,
    });
  }
}
