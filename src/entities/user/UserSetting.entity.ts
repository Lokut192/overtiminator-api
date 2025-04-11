import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { User } from './User.entity';

@Entity({ name: 'user_settings' })
@Unique(['user', 'code'])
export class UserSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column()
  value: string;
}
