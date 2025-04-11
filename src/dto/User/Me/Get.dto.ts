import { Expose } from 'class-transformer';

export class GetMeUserDto {
  @Expose()
  email: string;

  @Expose()
  username: string;
}
