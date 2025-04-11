import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/dto/User/Create.dto';
import { SignInUserDto } from 'src/dto/User/SignIn.dto';
import { User } from 'src/entities/User/User.entity';
import { UserService } from 'src/user/user.service';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(
    user: CreateUserDto,
    userMeta: Record<string, string> = {},
  ) {
    return this.userService.createUser(user, userMeta);
  }

  async signUserIn(signInUser: SignInUserDto) {
    // Get user with password
    let user: User | null = null;
    try {
      user = await (typeof signInUser.email === 'string'
        ? this.userService.findOneEmail(signInUser.email, { includePass: true })
        : this.userService.findOneUsername(signInUser.username!, {
            includePass: true,
          }));
    } catch (_userNotFoundException) {
      // Do nothing here
    }

    if (user === null) {
      throw new UnauthorizedException('No matching credentials found.');
    }

    // Check password
    const passwordMatch = await UtilsService.passwordMatch(
      signInUser.password,
      user.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('No matching credentials found.');
    }

    const bearer = this.jwtService.sign({
      id: user.id,
      username: user.username,
      email: user.email,
    });

    return { bearer };
  }
}
