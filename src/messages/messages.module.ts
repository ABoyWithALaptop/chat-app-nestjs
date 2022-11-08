import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { Services } from 'src/utils/constants';
import { Conversation, Message } from 'src/utils/typeorm';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  controllers: [MessageController],
  providers: [
    {
      provide: Services.MESSAGES,
      useClass: MessageService,
    },
  ],
  imports: [
    TypeOrmModule.forFeature([Message, Conversation]),
    ConversationsModule,
  ],
})
export class MessagesModule {}
