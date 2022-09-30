import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hassPassword } from 'src/utils/helpers';
import { User } from 'src/utils/typeorm';
import { CreateUserDetails } from 'src/utils/types';
import { Repository } from 'typeorm';
import { IUserService } from './user';

@Injectable()
export class UserService implements IUserService {

  constructor(@InjectRepository(User) private readonly userRepository : Repository<User>){

  }
  async createUser(userDetail: CreateUserDetails) {
    const existingUser = await this.userRepository.findOneBy({ email: userDetail.email });
    if (existingUser) { 
      return null;
    }
    const password = await hassPassword(userDetail.password);
    const newUSer = this.userRepository.create({ ...userDetail, password });
    return this.userRepository.save(newUSer);
  }
}
