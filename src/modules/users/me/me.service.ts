import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { LoggedUserType } from 'src/modules/auth/auth.types';

import { UsersService } from '../users.service';

@Injectable()
export class MeService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async getMe(loggedUser: LoggedUserType) {
    return this.usersService.findOne(loggedUser.userId);
  }
}
