import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOneTimeDto } from 'src/dto/Times/Times/CreateOne.dto';
import { Time } from 'src/entities/Time/Time.entity';
import { Repository } from 'typeorm';

import { TimeType } from './enums/TimeType.enum';

@Injectable()
export class TimesService {
  constructor(
    @InjectRepository(Time)
    private readonly timesRepository: Repository<Time>,
  ) {}

  async findOne(timeId: number, userId: number) {
    const query = this.timesRepository.createQueryBuilder('time');

    query.where('time.createdBy = :userId', { userId });
    query.andWhere('time.id = :timeId', { timeId });

    query.leftJoinAndSelect('time.createdBy', 'createdBy');
    query.leftJoinAndSelect('time.updatedBy', 'updatedBy');

    const time = await query.getOne();

    if (time === null) {
      throw new NotFoundException('Time not found.');
    }

    return time;
  }

  async findMany(userId: number) {
    const query = this.timesRepository.createQueryBuilder('time');

    query.where('time.createdBy = :userId', { userId });

    query.leftJoinAndSelect('time.createdBy', 'createdBy');
    query.leftJoinAndSelect('time.updatedBy', 'updatedBy');

    const times = await query.getMany();

    return times;
  }

  async createOne(timeCreationDto: CreateOneTimeDto, userId: number) {
    const time = this.timesRepository.create({
      createdBy: { id: userId },
      date: new Date(timeCreationDto.date),
      duration: timeCreationDto.duration,
      type: TimeType.Overtime,
    });

    await this.timesRepository.save(time);

    return this.findOne(time.id, userId);
  }
  async deleteOne(timeId: number, userId: number) {
    try {
      const time = await this.findOne(timeId, userId);

      await this.timesRepository.delete({ id: time.id });

      return;
    } catch (_timeNotFoundException) {
      throw new BadRequestException(`Time with id ${timeId} does not exist`);
    }
  }
}
