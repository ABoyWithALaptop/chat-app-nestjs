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
import {
  CreateConversationParams,
  createMessageParam,
  deleteMessageParams,
  modifyMessageParams,
} from 'src/utils/types';
import { Repository } from 'typeorm';
import { IMessageService } from './message';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class MessageService implements IMessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @Inject(Services.CONVERSATIONS)
    private readonly conversationService: IConversationsService,
    private eventEmitter: EventEmitter2,
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

  async getMessageByConversationId(
    conversationId: number,
    user: User,
  ): Promise<Message[]> {
    console.log('conversationId', conversationId);
    const message = await this.messageRepository.find({
      where: {
        conversation: { id: conversationId },
      },
      order: { createdAt: 'DESC' },
      relations: ['author'],

      withDeleted: false,
      // skip: 0,
      // take:3, // *pagination
    });
    const result = message.filter((m) => {
      if (m.author.id === user.id) {
        return m;
      } else {
        if (m.oneWayDelete === false) {
          return m;
        }
      }
    });

    return result;
  }
  async deleteMessage({ messageId, user }: deleteMessageParams) {
    const targetMessage = await this.messageRepository.findOne({
      where: { id: messageId },
      relations: ['conversation', 'author'],
    });

    console.log('targetMessage', targetMessage);
    if (targetMessage) {
      const currentConversation =
        await this.conversationService.getConversationById(
          targetMessage.conversation.id,
        );
      if (!currentConversation)
        throw new HttpException(
          'conversation not found',
          HttpStatus.BAD_REQUEST,
        );
      if (currentConversation.lastMessageSent.id === targetMessage.id) {
        const newLastMessage = await this.messageRepository.find({
          where: { conversation: { id: currentConversation.id } },
          withDeleted: false,
          order: { createdAt: 'DESC' },
          skip: 1,
          take: 1,
          relations: ['conversation'],
        });
        console.log('newLastMessage', newLastMessage[0]);
        if (newLastMessage) {
          console.log('newLastMessage', newLastMessage);
          await this.conversationService.setLastMessage(newLastMessage[0]);
        }
      }
      const result = await this.messageRepository.softDelete({
        id: messageId,
      });
      // * check who delete messages (soft delete or one way delete)
      if (targetMessage.author.id === user.id) {
        // * soft delete is when deleter is author
        console.log('soft delete');

        if (result) {
          console.log('result', result);
          const updatedMessage = await this.messageRepository.findOne({
            where: { id: messageId },
            withDeleted: true,
          });
          console.log('updatedMessage', updatedMessage);
          updatedMessage.twoWayDelete = true;
          const finalUpdatedMessage = await this.modifyMessageAndReturnFullInfo(
            updatedMessage,
          );
          this.eventEmitter.emit('message.deleted', finalUpdatedMessage);
        } else {
          console.log('result', result);
          throw new HttpException('message not found', HttpStatus.NOT_FOUND);
        }
      } else {
        // * one way delete is when deleter is not author
        console.log('one way delete');
        if (result) {
          const updatedMessage = await this.messageRepository.findOne({
            where: { id: messageId },
            withDeleted: true,
          });
          console.log('updatedMessage', updatedMessage);
          updatedMessage.oneWayDelete = true;
          const finalUpdatedMessage = await this.modifyMessageAndReturnFullInfo(
            updatedMessage,
          );
          this.eventEmitter.emit('message.deleted', finalUpdatedMessage);
        } else {
          console.log('result', result);
          throw new HttpException('message not found', HttpStatus.NOT_FOUND);
        }
      }

      return {
        id: messageId,
      };
    } else {
      throw new HttpException('message not found', HttpStatus.NOT_FOUND);
    }
  }
  async modifyMessageAndReturnFullInfo(payload: Message) {
    const { id } = await this.messageRepository.save(payload);
    const fullInfoMessage = await this.messageRepository.findOne({
      where: { id },
      relations: [
        'author',
        'conversation',
        'conversation.creator',
        'conversation.recipient',
        'conversation.lastMessageSent',
      ],
      withDeleted: true,
    });
    return fullInfoMessage;
  }
}
