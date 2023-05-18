import { Socket } from 'socket.io';
import { User } from './typeorm';
export interface AuthenticatedSocket extends Socket {
  user?: User;
  typing?: boolean;
}
