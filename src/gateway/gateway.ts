import { OnEvent } from '@nestjs/event-emitter';
import { Inject } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Services } from 'src/utils/constants';
import { Conversation, Message } from 'src/utils/typeorm';
import { IGatewaySessionManager } from './gateway.session';
import { AuthenticatedSocket } from 'src/utils/interfaces';

@WebSocketGateway({
  cors: {
    origin: ['https://localhost:3000', 'http://localhost:3000'],
    credentials: true,
  },
})
export class MessingGateway implements OnGatewayConnection {
  constructor(
    @Inject(Services.GATEWAY_SESSION_MANAGER)
    private readonly sessions: IGatewaySessionManager,
  ) {}
  handleConnection(client: AuthenticatedSocket, ...args: any[]) {
    console.log('income connection');
    console.log(client.id);
    this.sessions.setUserSocket(client.user.id, client);
    // console.log(this.sessions);
    client.emit('connected', { status: 'good' });
  }
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createMessage')
  handleCreateMessage(client: any, payload: string): void {
    console.log('Create message');
    console.log('inside created mess', payload);
    client.emit('connected', { status: 'good' });
  }

  @OnEvent('message.created')
  handleMessageCreateEvent(payload: Message) {
    console.log('inside handleMessageCreateEvent', payload);
    const {
      author,
      conversation: { creator, recipient },
    } = payload;
    const authorSocket = this.sessions.getUserSocket(author.id);
    console.log('authorSocket', authorSocket?.user);
    const recipientSocket =
      author.id === creator.id
        ? this.sessions.getUserSocket(recipient.id)
        : this.sessions.getUserSocket(creator.id);
    if (authorSocket) authorSocket.emit('onMessage', payload);
    if (recipientSocket) recipientSocket.emit('onMessage', payload);
    // this.server.emit('onMessage', payload);
  }
}
