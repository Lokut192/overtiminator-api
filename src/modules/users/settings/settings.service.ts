import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GlobalUserSetting } from 'src/entities/User/GlobalUserSetting.entity';
import { User } from 'src/entities/User/User.entity';
import { UserSetting } from 'src/entities/User/UserSetting.entity';
import { DeepPartial, Repository } from 'typeorm';

import { GlobalSettingsService } from '../global-settings/global-settings.service';
import { UsersService } from '../users.service';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  constructor(
    @InjectRepository(UserSetting)
    private readonly userSettingsRepository: Repository<UserSetting>,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly globalSettingsService: GlobalSettingsService,
  ) {}

  async findOneCode(userId: number, code: string) {
    const query = this.userSettingsRepository.createQueryBuilder('setting');

    query.where('setting.userId = :userId', { userId });
    query.andWhere('setting.code = :code', { code });

    const setting = await query.getOne();

    if (setting === null) {
      throw new NotFoundException('Setting not found.');
    }

    return setting;
  }

  async insertUserSettingsOnCreation(
    user: User,
    settings: Record<string, string>,
  ) {
    const globalSettings = await this.globalSettingsService.findMany();

    const userSettings: DeepPartial<UserSetting>[] = [];

    for (const setting of globalSettings) {
      let currentSetting: any | null = null;

      switch (setting.code) {
        case 'TIME_ZONE':
          currentSetting = await this.updateUserTimeZoneSetting(
            user,
            setting,
            settings.timeZone ?? setting.defaultValue,
          );
          if (currentSetting !== null) {
            userSettings.push(currentSetting);
          }
          break;
        default:
          break;
      }
    }

    const createdUserSettings =
      this.userSettingsRepository.create(userSettings);

    await this.userSettingsRepository.save(createdUserSettings);

    this.logger.log(`Settings set for user ${user.username}.`);
  }

  private async updateUserTimeZoneSetting(
    user: User,
    globalSetting: GlobalUserSetting,
    timeZone: string,
  ) {
    let setting: DeepPartial<UserSetting> | null = null;
    try {
      setting = await this.findOneCode(user.id, 'TIME_ZONE');
    } catch (_settingNotFoundError) {
      setting = {
        code: globalSetting.code,
        user,
      };
    }

    setting.value = timeZone;

    return setting;
  }
}
