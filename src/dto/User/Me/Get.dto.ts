import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetMeUserDto {
  @Expose()
  @ApiProperty({ example: 'john.doe@me.com' })
  email: string;

  @Expose()
  @ApiProperty({ example: 'john.doe' })
  username: string;
}
