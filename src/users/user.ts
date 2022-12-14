import { User } from 'src/utils/typeorm';
import { CreateUserDetails, findUserParams } from 'src/utils/types';

export interface IUserService {
  createUser(userDetail: CreateUserDetails): Promise<User>;
  findUser(findUserParams: findUserParams): Promise<User>;
  saveUser(user: User): Promise<User>;
  findUserWithPassword(findUserParams: findUserParams): Promise<User>;
}
