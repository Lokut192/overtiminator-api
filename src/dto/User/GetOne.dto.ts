import { IntersectionType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { GetOneBaseEntityDto } from '../core/BaseEntity/GetOne';

export class GetOneUserDto extends IntersectionType(GetOneBaseEntityDto) {
  @Expose()
  @ApiProperty({ example: 'john.doe' })
  username: string;

  @Expose()
  @ApiProperty({ example: 'john.doe@me.com' })
  email: string;
}
