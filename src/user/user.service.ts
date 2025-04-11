import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/User/User.entity';
import { Repository } from 'typeorm';

import { CreateUserDto } from '../dto/User/Create.dto';
import { UserSettingsService } from './user-settings/user-settings.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => UserSettingsService))
    private readonly userSettingsService: UserSettingsService,
  ) {}

  async findMany() {
    const usersQuery = this.userRepository.createQueryBuilder('user');

    const users = await usersQuery.getMany();

    return users;
  }

  async findOne(userId: number, options: { includePass?: boolean } = {}) {
    const userQuery = this.userRepository.createQueryBuilder('user');

    userQuery.where('user.id = :id', { id: userId });

    if (options.includePass) {
      userQuery.addSelect('user.password');
    }

    const user = await userQuery.getOne();

    if (user === null) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  async findOneUsername(
    username: string,
    options: { includePass?: boolean } = {},
  ) {
    const userQuery = this.userRepository.createQueryBuilder('user');

    userQuery.where('user.username = :username', { username });

    if (options.includePass) {
      userQuery.addSelect('user.password');
    }

    const user = await userQuery.getOne();

    if (user === null) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  async findOneEmail(email: string, options: { includePass?: boolean } = {}) {
    const userQuery = this.userRepository.createQueryBuilder('user');

    userQuery.where('user.email = :email', { email });

    if (options.includePass) {
      userQuery.addSelect('user.password');
    }

    const user = await userQuery.getOne();

    if (user === null) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  async createUser(user: CreateUserDto, meta: Record<string, string> = {}) {
    const existingUser = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: user.email })
      .orWhere('user.username = :username', { username: user.username })
      .getOne();

    if (existingUser !== null) {
      throw new ConflictException('User already exists');
    }

    const createdUser = this.userRepository.create(user);

    await this.userRepository.save(createdUser);

    this.logger.log(
      `Created user ${createdUser.email} with username ${createdUser.username}.`,
    );

    void this.userSettingsService.insertUserSettingsOnCreation(
      createdUser,
      meta,
    );

    return this.findOne(createdUser.id);
  }
}
