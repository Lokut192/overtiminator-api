import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { TimeStatistic } from 'src/entities/Time/Statistics/TimesStatistic.entity';
import { Time } from 'src/entities/Time/Time.entity';
import { User } from 'src/entities/User/User.entity';
import { DeepPartial, Repository } from 'typeorm';

import { TimeType } from '../enums/TimeType.enum';

@Injectable()
export class StatisticsService {
  private readonly logger = new Logger('TimesStatisticsService');

  constructor(
    @InjectRepository(TimeStatistic)
    private readonly statsRepository: Repository<TimeStatistic>,
    @InjectRepository(Time)
    private readonly timesRepository: Repository<Time>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async generateUser(userId: number, utcMonthNumber: number, utcYear: number) {
    this.logger.log(`Starting statistics generation for user ${userId}.`);

    // #region User

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

    // #endregion User

    // #region Time zones

    this.logger.debug(`Getting user time zones...`);

    const defaultTimeZone = 'UTC';
    const userTimeZone =
      user.userSettings.find((s) => s.code === 'TIME_ZONE')?.value ??
      defaultTimeZone;

    const timeZones = new Set([userTimeZone, defaultTimeZone]);

    this.logger.debug(
      `Found ${timeZones.size} time zones for user ${userId}: ${[...timeZones].join(', ')}.`,
    );

    // #endregion Time zones

    // #region Defining periods

    this.logger.debug(`Defining periods for time zone(s)...`);

    const periods: { start: DateTime; end: DateTime }[] = [];

    for (const tz of timeZones) {
      const startDate = DateTime.fromObject({
        month: utcMonthNumber,
        year: utcYear,
      })
        .startOf('month')
        .setZone(tz, { keepLocalTime: true });
      const endDate = startDate.endOf('month');

      periods.push({
        start: startDate,
        end: endDate,
      });
    }

    this.logger.debug(
      `Periods defined for user ${userId}: ${JSON.stringify(periods, null, 2)}.`,
    );

    // #endregion Defining periods

    // #region Existing stats deletion

    for (const { start } of periods) {
      const currentTimeZone = start.zoneName!;
      const sanitizedTimeZone = currentTimeZone.trim();

      // Delete current period stats if exists
      this.logger.debug(`Deleting stats for time zone ${sanitizedTimeZone}...`);
      this.logger.debug(
        `Using timeZone param = "${sanitizedTimeZone}" (length: ${sanitizedTimeZone.length})`,
      );

      const existingStatsDeletionQuery = this.statsRepository
        .createQueryBuilder()
        .delete()
        .where(`user_id = :userId`, {
          userId,
        })
        .andWhere('year = :year', {
          year: start.year,
        })
        .andWhere('month = :month', {
          month: start.month,
        })
        .andWhere('time_zone = :timeZone', {
          timeZone: sanitizedTimeZone,
        });

      const existingStatsDeletionResult =
        await existingStatsDeletionQuery.execute();

      this.logger.debug(
        `Deleted ${existingStatsDeletionResult.affected} stats for time zone ${sanitizedTimeZone}.`,
      );
    }

    // #endregion Existing stats deletion

    // #region Generating statistics

    this.logger.debug(`Generating stats for user ${userId}...`);

    const newStats: DeepPartial<TimeStatistic>[] = [];

    for (const { start, end } of periods) {
      const currentTimeZone = start.zoneName!;
      const sanitizedTimeZone = currentTimeZone.trim();
      const timesQuery = this.timesRepository.createQueryBuilder('times');

      timesQuery.where('times.user = :userId', { userId });
      timesQuery.andWhere('times.date >= :startDate', {
        startDate: start.toJSDate(),
      });
      timesQuery.andWhere('times.date <= :endDate', {
        endDate: end.toJSDate(),
      });

      const timesCount = await timesQuery.getCount();
      const times = await timesQuery.getMany();

      const totalOvertimeStats = times.reduce(
        (acc, time) => {
          switch (time.type) {
            case TimeType.Overtime:
            default:
              return {
                timesCount: acc.timesCount + 1,
                totalDuration: acc.totalDuration + time.duration,
              };
          }
        },
        { timesCount: 0, totalDuration: 0 },
      );

      const totalDuration = times.reduce((acc, time) => {
        switch (time.type) {
          case TimeType.Overtime:
          default:
            return acc + time.duration;
        }
      }, 0);

      const generatedStats: DeepPartial<TimeStatistic> = {};
      generatedStats.month = start.month;
      generatedStats.year = start.year;
      generatedStats.timeZone = sanitizedTimeZone;
      generatedStats.overtimeTimesCount = totalOvertimeStats.timesCount;
      generatedStats.overtimeTotalDuration = totalOvertimeStats.totalDuration;
      generatedStats.timesCount = timesCount;
      generatedStats.totalDuration = totalDuration;
      generatedStats.userId = userId;

      const createdStats = this.statsRepository.create(generatedStats);

      newStats.push(createdStats);
    }

    this.logger.debug(`Generated stats: ${JSON.stringify(newStats, null, 2)}`);

    await this.statsRepository.save(newStats);

    // #endregion Generating statistics
  }
}
