import { Injectable } from '@nestjs/common';
import { User } from 'src/utils/typeorm';
import { AuthenticatedSocket } from '../utils/interfaces';
export interface IGatewaySessionManager {
  getUserSocket(id: number): AuthenticatedSocket;
  setUserSocket(userId: number, socket: AuthenticatedSocket);
  removeUserSocket(userId: number);
  getSockets(): Map<number, AuthenticatedSocket>;
  setTyping(userId: number, typing: boolean);
  getAllTyping(conversationId: number): User[];
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
  setTyping(userId: number, typing: boolean) {
    const socket = this.sessions.get(userId);
    socket.typing = typing;
  }
  getAllTyping(conversationId: number): User[] {
    const typingUsers: User[] = [];

    this.sessions.forEach((socket, userId) => {
      if (socket.typing && socket.rooms.has(`conversation:${conversationId}`))
        typingUsers.push(socket.user);
    });
    console.log('typingUsers', typingUsers);
    return typingUsers;
  }
}
