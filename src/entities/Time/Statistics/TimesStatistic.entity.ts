import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';

import { User } from '../../User/User.entity';

@Entity({ name: 'times_statistics' })
@Unique(['month', 'year', 'timeZone', 'userId'])
export class TimeStatistic {
  @Column({ name: 'overtime_times_count' })
  overtimeTimesCount: number;

  @Column({ name: 'overtime_total_duration' })
  overtimeTotalDuration: number;

  @Column({ name: 'times_count' })
  timesCount: number;

  @Column({ name: 'total_duration' })
  totalDuration: number;

  @PrimaryColumn()
  month: number;

  @PrimaryColumn()
  year: number;

  @PrimaryColumn({ name: 'time_zone' })
  timeZone: string;

  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
