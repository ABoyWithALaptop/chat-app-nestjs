import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { hassPassword } from 'src/utils/helpers';
import { User } from 'src/utils/typeorm';
import { CreateUserDetails, findUserParams } from 'src/utils/types';
import { Repository } from 'typeorm';
import { IUserService } from './user';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async createUser(userDetail: CreateUserDetails) {
    const existingUser = await this.userRepository.findOne({
      email: userDetail.email,
    });
    if (existingUser) {
      return null;
    }
    const password = await hassPassword(userDetail.passWord);
    const newUSer = this.userRepository.create({ ...userDetail, password });
    return this.userRepository.save(newUSer);
  }

  async findUser(findUserParams: findUserParams) {
    const user = await this.userRepository.findOne(findUserParams, {});
    const userNoPassword = instanceToPlain(user) as User;
    return userNoPassword;
  }

  async saveUser(user: User) {
    return this.userRepository.save(user);
  }

  async findUserWithPassword(findUserParams: findUserParams) {
    const user = await this.userRepository.findOne(findUserParams, {});
    return user;
  }
}
