import { IntersectionType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { DateTime } from 'luxon';
import { GetOneBaseEntityDto } from 'src/dto/core/BaseEntity/GetOne';

export class GetOneTimeDto extends IntersectionType(GetOneBaseEntityDto) {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: 60 })
  duration: number;

  @Expose()
  @ApiProperty({ example: '20250-01-01T00:00:00.000Z' })
  date: string;

  @Expose()
  @ApiProperty({ example: 1 })
  @Transform(({ obj }) => {
    return !!obj.user
      ? {
          id: obj.user?.id,
          email: obj.user?.email,
          username: obj.user?.username ?? null,
        }
      : null;
  })
  user: {
    id: number;
    email: string;
    username: string | null;
  } | null;

  @Expose()
  @ApiProperty({ example: DateTime.now().toUTC().toISO() })
  createdAt: Date;

  @Expose()
  @ApiProperty({ example: DateTime.now().toUTC().toISO() })
  updatedAt: Date | null;
}
