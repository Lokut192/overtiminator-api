import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'global_user_settings' })
export class GlobalUserSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column({ nullable: false })
  label: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: false, name: 'default_value' })
  defaultValue: string;

  // @Column({ default: true })
  // alwaysApplied: boolean = true;
}
