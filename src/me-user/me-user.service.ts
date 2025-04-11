import { Injectable } from '@nestjs/common';
import { LoggedUserType } from 'src/types/auth/LoggedUser.type';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MeUserService {
  constructor(private readonly userService: UserService) {}

  async getMe(loggedUser: LoggedUserType) {
    return this.userService.findOne(loggedUser.userId);
  }
}
