import { IsEmail, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class SignInUserDto {
  @ValidateIf((o) => !o.username)
  @IsEmail({}, { message: 'Invalid email.' })
  email?: string;

  @ValidateIf((o) => !o.email)
  @IsString()
  @IsNotEmpty({ message: 'Username cannot be empty.' })
  username?: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
