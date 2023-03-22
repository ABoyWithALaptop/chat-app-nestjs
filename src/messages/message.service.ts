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
    let savedMessage = await this.messageRepository.save(message);
    const updatedConversation = await this.conversationService.setLastMessage(
      savedMessage,
    );
    if (updatedConversation) {
      savedMessage = await this.messageRepository.findOne({
        where: { id: savedMessage.id },
        relations: [
          'author',
          'conversation',
          'conversation.creator',
          'conversation.recipient',
          'conversation.lastMessageSent',
        ],
      });
    }
    return savedMessage;
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
