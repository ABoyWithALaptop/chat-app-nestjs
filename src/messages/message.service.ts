import {
  Body,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IConversationsService } from 'src/conversations/conversations';
import { Services } from 'src/utils/constants';
import { Conversation, Message } from 'src/utils/typeorm';
import { createMessageParam } from 'src/utils/types';
import { Repository } from 'typeorm';
import { IMessageService } from './message';

@Injectable()
export class MessageService implements IMessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @Inject(Services.CONVERSATIONS)
    private readonly conversationService: IConversationsService,
  ) {}

  async createMessage({ user, content, conversationId }: createMessageParam) {
    const conversation = await this.conversationService.getConversationById(
      conversationId,
    );
    console.log('id', conversationId);
    console.log(conversation);
    if (!conversation)
      throw new HttpException('conversation not found', HttpStatus.BAD_REQUEST);
    const { creator, recipient } = conversation;

    if (creator.id !== user.id && recipient.id !== user.id)
      throw new HttpException(
        'Cant create message in this conversation',
        HttpStatus.FORBIDDEN,
      );
    console.log(Date.now());

    const message = await this.messageRepository.create({
      content,
      conversation,
      author: user,
      createdAt: Date.now(),
    });

    const savedMessage = await this.messageRepository.save(message);
    return savedMessage;
  }
}
