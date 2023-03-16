import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserService } from 'src/users/user';
import { Services } from 'src/utils/constants';
import { comparePassword } from 'src/utils/helpers';
import { Session } from 'src/utils/typeorm';
import { validateUserDetails } from 'src/utils/types';
import { Repository } from 'typeorm';
import { IAuthService } from './auth';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(Services.USERS) private readonly userService: IUserService,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}
  async validateUser(userCredentials: validateUserDetails) {
    const user = await this.userService.findUserWithPassword({
      email: userCredentials.email,
    });
    if (!user) {
      throw new HttpException('invalid Credentials', HttpStatus.UNAUTHORIZED);
    }
    return (await comparePassword(userCredentials.password, user.password))
      ? user
      : null;
  }
}
