import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { hassPassword } from 'src/utils/helpers';
import { User } from 'src/utils/typeorm';
import {
  CreateUserDetails,
  findAllUserParams,
  findUserParams,
} from 'src/utils/types';
import { Not, Repository } from 'typeorm';
import { IUserService } from './user';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async createUser(userDetail: CreateUserDetails) {
    const existingUser = await this.userRepository.findOne({
      where: { email: userDetail.email },
    });
    if (existingUser) {
      return null;
    }
    const password = await hassPassword(userDetail.passWord);
    const newUSer = this.userRepository.create({ ...userDetail, password });
    return this.userRepository.save(newUSer);
  }

  async findUser(findUserParams: findUserParams) {
    const user = await this.userRepository.findOne({
      where: { ...findUserParams },
    });
    const userNoPassword = instanceToPlain(user) as User;
    return userNoPassword;
  }

  async saveUser(user: User) {
    return this.userRepository.save(user);
  }

  async findUserWithPassword(findUserParams: findUserParams) {
    const user = await this.userRepository.findOne({
      where: { ...findUserParams },
      select: ['id', 'email', 'firstName', 'lastName', 'password'],
    });
    return user;
  }
  async findAllUsersWithConditions(findAllUserParams: findAllUserParams) {
    return this.userRepository.find({
      // select: ['id', 'email', 'firstName', 'lastName'],
      where: { ...findAllUserParams },
    });
  }
  async findAvailableUsers(user: User) {
    const users = await this.userRepository.find({
      where: { id: Not(user.id) },
    });
    return users;
  }
}
