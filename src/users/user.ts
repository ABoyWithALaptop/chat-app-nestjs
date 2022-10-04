import { User } from 'src/utils/typeorm';
import { CreateUserDetails, findUserParams } from 'src/utils/types';

export interface IUserService {
  createUser(userDetail: CreateUserDetails): Promise<User>;
  findUser(findUserParams: findUserParams): Promise<User>;
}
