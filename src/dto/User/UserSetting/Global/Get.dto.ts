import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetGlobalUserSettingDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: 'TIME_ZONE' })
  code: string;

  @Expose()
  @ApiProperty({ example: 'Time zone' })
  label: string;

  @Expose()
  @ApiProperty({ example: 'User time zone', nullable: true })
  description: string | null;

  @Expose()
  @ApiProperty({ example: 'Europe/Paris' })
  defaultValue: string;

  @Expose()
  @ApiProperty({ example: true })
  alwaysApplied: boolean;
}
