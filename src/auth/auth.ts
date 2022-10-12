import { User } from 'src/utils/typeorm';
import { validateUserDetails } from 'src/utils/types';

export interface IAuthService {
  validateUser(userCredentials: validateUserDetails): Promise<User> | null;
}
