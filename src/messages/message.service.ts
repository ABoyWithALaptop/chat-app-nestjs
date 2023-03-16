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
import { Conversation, Message, User } from 'src/utils/typeorm';
import { CreateConversationParams, createMessageParam } from 'src/utils/types';
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

  async createMessage({
    user,
    content,
    conversationId,
  }: createMessageParam): Promise<Message> {
    const conversation = await this.conversationService.getConversationById(
      conversationId,
    );
    if (!conversation) {
      throw new HttpException('conversation not found', HttpStatus.BAD_REQUEST);
    }
    const { creator, recipient } = conversation;

    if (creator.id !== user.id && recipient.id !== user.id)
      throw new HttpException(
        'Cant create message in this conversation',
        HttpStatus.FORBIDDEN,
      );

    const message = await this.messageRepository.create({
      content,
      conversation,
      author: user,
    });
    const savedMessage = await this.messageRepository.save(message);
    await this.conversationService.setLastMessage(savedMessage);
    return savedMessage;
  }

  async firstSentMessage(user: User, params: CreateConversationParams) {
    const conversation = await this.conversationService.createConversations(
      user,
      params,
    );
    const content = params.message;
    return this.createMessage({
      user,
      content,
      conversationId: conversation.id,
    });
  }

  async getMessageByConversationId(conversationId: number): Promise<Message[]> {
    return await this.messageRepository.find({
      where: {
        conversation: { id: conversationId },
      },
      order: { createdAt: 'DESC' },
      relations: ['author'],

      // skip: 0,
      // take:3, // *pagination
    });
  }
}
