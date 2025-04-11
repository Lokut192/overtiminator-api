import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { CreateGlobalUserSettingDto } from 'src/dto/User/UserSetting/Global/Create.dto';
import { UpdateGlobalUserSettingDto } from 'src/dto/User/UserSetting/Global/Update.dto';
import { GlobalUserSetting } from 'src/entities/User/GlobalUserSetting.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GlobalUserSettingsService {
  private readonly logger = new Logger(GlobalUserSettingsService.name);

  constructor(
    @InjectRepository(GlobalUserSetting)
    private readonly settingsRepository: Repository<GlobalUserSetting>,
  ) {}

  async findOne(id: number) {
    const query = this.settingsRepository.createQueryBuilder('setting');

    query.where('setting.id = :id', { id });

    const setting = await query.getOne();

    if (setting === null) {
      throw new NotFoundException('Setting not found.');
    }

    return setting;
  }

  async findOneCode(code: string) {
    const query = this.settingsRepository.createQueryBuilder('setting');

    query.where('setting.code = :code', { code });

    const setting = await query.getOne();

    if (setting === null) {
      throw new NotFoundException('Setting not found.');
    }

    return setting;
  }

  async findMany() {
    const query = this.settingsRepository.createQueryBuilder('setting');

    const settings = await query.getMany();

    return settings;
  }

  async createOne(settingEntry: CreateGlobalUserSettingDto) {
    const setting = plainToInstance(GlobalUserSetting, settingEntry);

    const existingSetting = await this.findOneCode(setting.code);

    if (existingSetting !== null) {
      throw new ConflictException('Setting already exists.');
    }

    const createdSetting = this.settingsRepository.create(setting);

    await this.settingsRepository.save(createdSetting);

    this.logger.log(
      `Created setting ${createdSetting.code} with default value ${createdSetting.defaultValue}.`,
    );

    return this.findOne(createdSetting.id);
  }

  async updateOne(code: string, settingEntry: UpdateGlobalUserSettingDto) {
    const setting = plainToInstance(GlobalUserSetting, settingEntry, {
      excludeExtraneousValues: true,
    });

    const existingSetting = await this.findOneCode(code);

    if (existingSetting === null) {
      throw new BadRequestException('Setting not found.');
    }

    if (existingSetting.code !== setting.code) {
      let existingSettingCode: GlobalUserSetting | null = null;

      try {
        existingSettingCode = await this.findOneCode(setting.code);
      } catch (_settingNotFoundError) {
        // Do nothing, setting code is available
        existingSettingCode = null;
      }

      if (existingSettingCode !== null) {
        throw new ConflictException(
          `Setting with code ${setting.code} already exists.`,
        );
      }
    }

    existingSetting.code = setting.code;
    existingSetting.label = setting.label;
    existingSetting.description = setting.description;
    existingSetting.defaultValue = setting.defaultValue;
    existingSetting.alwaysApplied = setting.alwaysApplied;

    await this.settingsRepository.save(existingSetting);

    return this.findOne(existingSetting.id);
  }
}
