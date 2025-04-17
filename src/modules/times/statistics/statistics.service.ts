import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { TimeStatistic } from 'src/entities/Time/Statistics/TimesStatistic.entity';
import { Time } from 'src/entities/Time/Time.entity';
import { User } from 'src/entities/User/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StatisticsService {
  private readonly logger = new Logger(StatisticsService.name);

  constructor(
    @InjectRepository(TimeStatistic)
    private readonly statsRepository: Repository<TimeStatistic>,
    @InjectRepository(Time)
    private readonly timesRepository: Repository<Time>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async generateForUser(
    userId: number,
    period: { start: string; end: string },
  ) {
    this.logger.debug(`Starting statistics generation for user ${userId}.`);
    this.logger.debug(`Getting user ${userId} from database...`);

    // Getting user
    const userQuery = this.usersRepository.createQueryBuilder('user');

    userQuery.where('user.id = :userId', { userId });
    userQuery.andWhere('user.deleted = :deleted', { deleted: false });
    userQuery.leftJoinAndSelect('user.userSettings', 'userSettings');

    const user = await userQuery.getOne();

    if (user === null) {
      this.logger.error(
        `Could not found user ${userId} for generating statistics.`,
      );
      return;
    }
    this.logger.debug(`User ${userId} found in database.`);

    // Checking user has times
    this.logger.debug(`Checking user ${userId} has times...`);
    const userTimesCount = await this.timesRepository.count({
      where: { user: { id: userId } },
    });
    if (userTimesCount === 0) {
      this.logger.error(
        `User ${userId} has no times for generating statistics.`,
      );
      return;
    }
    this.logger.debug(`User ${userId} has ${userTimesCount} times.`);

    /* Getting and extracting user data */
    // Getting user times
    const userTimesQuery = this.timesRepository.createQueryBuilder('time');
    userTimesQuery.where('time.user = :userId', { userId });
    const userTimes = await userTimesQuery.getMany();

    // Getting user settings
    const { userSettings } = user;

    // Getting user time zone with a fallback
    const userTimeZone =
      userSettings.find((s) => s.code === 'TIME_ZONE')?.value ?? 'UTC';

    // Determine for which time zone the statistics should be generated
    const timeZonesForGeneration = [...new Set([userTimeZone, 'UTC'])];
    this.logger.debug(
      `Generating statistics for time zones: ${timeZonesForGeneration.join(',')} for user ${userId}...`,
    );

    for (const timeZone of timeZonesForGeneration) {
      const startDate = DateTime.fromISO(period.start).setZone(timeZone, {
        keepLocalTime: true,
      });
      const endDate = DateTime.fromISO(period.end).setZone(timeZone, {
        keepLocalTime: true,
      });

      const timeZoneTimesQuery =
        this.timesRepository.createQueryBuilder('time');
      timeZoneTimesQuery.where('time.user = :userId', { userId });
      timeZoneTimesQuery.andWhere('time.date >= :startDate', {
        startDate: startDate.toJSDate(),
      });
      timeZoneTimesQuery.andWhere('time.date <= :endDate', {
        endDate: endDate.toJSDate(),
      });

      const timeZoneTimes = await timeZoneTimesQuery.getMany();

      this.logger.debug(
        `Times for period (${startDate.toISO()} - ${endDate.toISO()}):`,
      );
      this.logger.debug(JSON.stringify(timeZoneTimes, null, 2));
    }

    this.logger.debug(`Statistics successfully generated for user ${userId}.`);
  }
}
