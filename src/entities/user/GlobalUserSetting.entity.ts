import { Expose } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'global_user_settings' })
export class GlobalUserSetting {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ unique: true })
  code: string;

  @Expose()
  @Column({ nullable: false })
  label: string;

  @Expose()
  @Column({ nullable: true })
  description: string;

  @Expose()
  @Column({ nullable: false, name: 'default_value' })
  defaultValue: string;

  @Expose()
  @Column({ default: true, name: 'always_applied' })
  alwaysApplied: boolean = true;
}
