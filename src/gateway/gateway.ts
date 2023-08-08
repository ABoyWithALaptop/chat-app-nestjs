import { OnEvent } from '@nestjs/event-emitter';
import { Inject } from '@nestjs/common';
import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Services } from 'src/utils/constants';
import { Conversation, Message } from 'src/utils/typeorm';
import { IGatewaySessionManager } from './gateway.session';
import { AuthenticatedSocket } from 'src/utils/interfaces';
import { IConversationsService } from 'src/conversations/conversations';

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
    @Inject(Services.CONVERSATIONS)
    private readonly conversationsService: IConversationsService,
  ) {}
  handleConnection(client: AuthenticatedSocket, ...args: any[]) {
    this.conversationsService
      .findDefault(client.user?.id)
      .then((conversations) => {
        conversations.forEach((conversation) => {
          client.join(`conversation:${conversation.id}`);
        });
        console.log('after join', client.rooms);
      })
      .catch((err) => {
        console.log(err);
      });
    // console.log('room at server', this.server.sockets.adapter.rooms);

    this.sessions.setUserSocket(client.user.id, client);
    // console.log(this.sessions);
    console.table(this.sessions.getSockets());
    client.emit('connected', { status: 'good' });
  }

  @SubscribeMessage('joinConversations')
  handleJoinConversations(client: AuthenticatedSocket) {
    console.log('join room');
    this.conversationsService
      .findDefault(client.user.id)
      .then((conversations) => {
        conversations.forEach((conversation) => {
          client.join(`conversation:${conversation.id}`);
        });
        console.log('after join', client.rooms);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  @SubscribeMessage('typing')
  handleTyping(client: AuthenticatedSocket, payload: number) {
    console.log(`chanel typing: ${payload}`);
    if (client.typing) {
      return;
      // this.server.in(`conversation:${payload}`).emit('userType', null);
    } else {
      this.sessions.setTyping(client.user.id, true);
      const setOfUserTyping = this.sessions.getAllTyping(payload);
      console.log(`setOfUserTyping: ${setOfUserTyping}`);
      this.server
        .in(`conversation:${payload}`)
        .emit('userType', { user: setOfUserTyping, idNumber: payload });
    }
  }
  @SubscribeMessage('notTyping')
  handleNotTyping(client: AuthenticatedSocket, payload: number) {
    console.log('not typing', client.user.id);
    this.sessions.setTyping(client.user.id, false);
    const setOfUserTyping = this.sessions.getAllTyping(payload);
    console.log('setOfUserStillTyping', setOfUserTyping);
    this.server
      .in(`conversation:${payload}`)
      .emit('userNotTyping', setOfUserTyping);
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
      conversation: { id },
    } = payload;
    const authorSocket = this.sessions.getUserSocket(author.id);
    if (this.server.sockets.adapter.rooms.get(`conversation:${id}`)) {
      console.log('send to room', `conversation:${id}`);
      this.server.in(`conversation:${id}`).emit('onMessage', payload);
    }
  }
  @OnEvent('conversations.created')
  handleConversationCreateEvent(payload: Conversation) {
    console.log('inside handleConversationCreateEvent', payload);
    const { creator, recipient } = payload;
    const recipientSocket = this.sessions.getUserSocket(recipient.id);
    if (recipientSocket) recipientSocket.emit('newConversation', payload);
  }
  @OnEvent('message.deleted')
  handleMessageDeleteEvent(payload: { message: Message; userId: number }) {
    console.log('inside handleMessageDeleteEvent', payload.message);
    if (payload.message.twoWayDelete) {
      this.server
        .in(`conversation:${payload.message.conversation.id}`)
        .emit('onMessageDelete', payload);
    } else if (payload.message.oneWayDelete) {
      console.log('one way delete');
      const userSocket = this.sessions.getUserSocket(payload.userId);
      userSocket.emit('onMessageDelete', payload.message);
    }
  }
}
