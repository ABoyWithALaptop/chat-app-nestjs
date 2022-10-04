import { validateUserDetails } from 'src/utils/types';

export interface IAuthService {
  validateUser(userCredentials: validateUserDetails);
}
