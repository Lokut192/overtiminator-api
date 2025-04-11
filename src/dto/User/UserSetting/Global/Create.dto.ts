import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateGlobalUserSettingDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'TIME_ZONE' })
  code: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Time zone' })
  label: string;

  @IsOptional()
  @ValidateIf((_object, value) => value !== null)
  @IsString()
  @Transform(({ value }) => value ?? null)
  @ApiProperty({ example: 'User time zone', required: false, default: null })
  description: string | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Europe/Paris' })
  defaultValue: string;

  @IsOptional()
  @ValidateIf((_object, value) => value !== null)
  @IsBoolean()
  @Transform(({ value }) => value || false)
  @ApiProperty({ example: true, required: false, default: true })
  alwaysApplied: boolean;
}
