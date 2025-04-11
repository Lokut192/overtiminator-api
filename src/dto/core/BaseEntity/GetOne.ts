import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { DateTime } from 'luxon';

export class GetOneBaseEntityDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: DateTime.now().toUTC().toISO() })
  createdAt: Date;

  @Expose()
  @ApiProperty({ example: 1 })
  @Transform(({ obj }) => {
    return !!obj.createdBy
      ? {
          id: obj.createdBy?.id,
          email: obj.createdBy?.email,
          username: obj.createdBy?.username ?? null,
        }
      : null;
  })
  createdBy: {
    id: number;
    email: string;
    username: string | null;
  } | null;

  @Expose()
  @ApiProperty({ example: DateTime.now().toUTC().toISO() })
  updatedAt: Date | null;

  @Expose()
  @ApiProperty({ example: 1 })
  @Transform(({ obj }) => {
    return !!obj.updatedBy
      ? {
          id: obj.updatedBy?.id,
          email: obj.updatedBy?.email,
          username: obj.updatedBy?.username ?? null,
        }
      : null;
  })
  updatedBy: {
    id: number;
    email: string;
    username: string | null;
  } | null;

  @Expose()
  @ApiProperty({ example: true })
  deleted: boolean;

  @Expose()
  @ApiProperty({ example: DateTime.now().toUTC().toISO() })
  deletedAt: Date | null;
}
