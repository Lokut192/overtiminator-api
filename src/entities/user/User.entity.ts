import * as bcrypt from 'bcryptjs';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserSetting } from './UserSetting.entity';

@Entity({ name: 'users' })
export class User {
  @Column()
  email: string;

  @Column({ nullable: true })
  username: string;

  @Column({ select: false })
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  // Base entity to avoid circular dependencies
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    precision: 3,
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updatedBy: User;

  @Column({
    precision: 3,
    type: 'datetime',
    onUpdate: 'CURRENT_TIMESTAMP',
    name: 'updated_at',
    nullable: true,
  })
  updatedAt: Date;

  @Column({ default: false })
  deleted: boolean;

  @Column({
    precision: 3,
    type: 'datetime',
    name: 'deleted_at',
    nullable: true,
  })
  deletedAt: Date;

  @OneToMany(() => UserSetting, (userSetting) => userSetting.user)
  userSettings: UserSetting[];
}
