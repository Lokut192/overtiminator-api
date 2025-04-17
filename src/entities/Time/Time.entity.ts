import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { TimeType } from '../../modules/times/enums/TimeType.enum';
import { User } from '../User/User.entity';

@Entity({ name: 'times' })
export class Time {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  duration: number;

  @Column({
    precision: 3,
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date;

  @Column({
    type: 'varchar',
    default: TimeType.Overtime,
  })
  type: TimeType;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    precision: 3,
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @Column({
    precision: 3,
    type: 'datetime',
    onUpdate: 'CURRENT_TIMESTAMP',
    name: 'updated_at',
    nullable: true,
  })
  updatedAt: Date;
}
