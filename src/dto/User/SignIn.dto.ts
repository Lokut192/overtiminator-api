import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class SignInUserDto {
  @ValidateIf((o) => !o.username)
  @IsEmail({}, { message: 'Invalid email.' })
  @ApiProperty({ example: 'john.doe@me.com', required: false })
  email?: string;

  @ValidateIf((o) => !o.email)
  @IsString()
  @IsNotEmpty({ message: 'Username cannot be empty.' })
  @ApiProperty({ example: 'john.doe', required: false })
  username?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, example: '*****' })
  password: string;
}
