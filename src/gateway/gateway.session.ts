import { Injectable } from '@nestjs/common';
import { AuthenticatedSocket } from '../utils/interfaces';
export interface IGatewaySessionManager {
  getUserSocket(id: number): AuthenticatedSocket;
  setUserSocket(userId: number, socket: AuthenticatedSocket);
  removeUserSocket(userId: number);
  getSockets(): Map<number, AuthenticatedSocket>;
}

@Injectable()
export class GatewaySessionManager implements IGatewaySessionManager {
  private readonly sessions: Map<number, AuthenticatedSocket> = new Map<
    number,
    AuthenticatedSocket
  >();

  getUserSocket(id: number) {
    return this.sessions.get(id);
  }
  setUserSocket(userId: number, socket: AuthenticatedSocket) {
    this.sessions.set(userId, socket);
  }
  removeUserSocket(userId: number) {
    this.sessions.delete(userId);
  }
  getSockets(): Map<number, AuthenticatedSocket> {
    return this.sessions;
  }
}
