import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../User/User.entity';

@Entity({ name: 'times_statistics' })
export class TimeStatistic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'times_count' })
  timesCount: number;

  @Column({ name: 'total_duration' })
  totalDuration: number;

  @Column()
  month: number;

  @Column()
  year: number;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
