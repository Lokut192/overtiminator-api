import { IntersectionType } from '@nestjs/mapped-types';
import { Expose } from 'class-transformer';

import { GetOneBaseEntityDto } from '../core/BaseEntity/GetOne';

export class GetOneUserDto extends IntersectionType(GetOneBaseEntityDto) {
  @Expose()
  username: string;

  @Expose()
  email: string;
}
