import { Column, Entity } from 'typeorm';

import { TimeType } from '../../modules/times/enums/TimeType.enum';
import { BaseEntity } from '../core/base.entity';

@Entity({ name: 'times' })
export class Time extends BaseEntity {
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
}
