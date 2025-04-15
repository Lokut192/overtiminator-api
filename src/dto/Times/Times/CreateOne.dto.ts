import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { TimeType } from 'src/modules/times/enums/TimeType.enum';

export class CreateOneTimeDto {
  @ApiProperty({
    example: TimeType.Overtime,
    default: TimeType.Overtime,
    enum: TimeType,
  })
  @IsEnum(TimeType)
  @IsOptional()
  @Transform(({ value }) => value ?? TimeType.Overtime)
  type: TimeType = TimeType.Overtime;

  @ApiProperty({ example: 60 })
  @IsNumber()
  @IsPositive()
  duration: number;

  @ApiProperty({ example: '20250-01-01T00:00:00.000Z' })
  @IsDateString()
  date: string;
}
