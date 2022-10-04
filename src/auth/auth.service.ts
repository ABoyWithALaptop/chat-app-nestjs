import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IUserService } from 'src/users/user';
import { Services } from 'src/utils/constants';
import { comparePassword } from 'src/utils/helpers';
import { validateUserDetails } from 'src/utils/types';
import { IAuthService } from './auth';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(Services.USERS) private readonly userService: IUserService,
  ) {}
  async validateUser(userCredentials: validateUserDetails) {
    const user = await this.userService.findUser({
      email: userCredentials.email,
    });
    if (!user) {
      throw new HttpException('invalid Credentials', HttpStatus.UNAUTHORIZED);
    }
    return await comparePassword(userCredentials.password, user.password);
  }
}
