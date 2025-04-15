import { IntersectionType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { GetOneBaseEntityDto } from 'src/dto/core/BaseEntity/GetOne';

export class GetOneTimeDto extends IntersectionType(GetOneBaseEntityDto) {
  @Expose()
  @ApiProperty({ example: 60 })
  duration: number;

  @Expose()
  @ApiProperty({ example: '20250-01-01T00:00:00.000Z' })
  date: string;
}
