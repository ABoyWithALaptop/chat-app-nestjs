import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IMessageService } from 'src/messages/message';
import { IUserService } from 'src/users/user';
import { Services } from 'src/utils/constants';
import { Conversation, Message, User } from 'src/utils/typeorm';
import { CreateConversationParams } from 'src/utils/types';
import { Repository } from 'typeorm';
import { IConversationsService } from './conversations';

@Injectable()
export class ConversationsService implements IConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @Inject(Services.USERS)
    private readonly userService: IUserService, // @Inject(Services.MESSAGES) // private readonly messageService: IMessageService,
  ) {}

  async findAll() {
    return await this.conversationRepository
      .createQueryBuilder('conversations')
      .select('conversations')
      .leftJoinAndSelect('conversations.creator', 'creator')
      .leftJoinAndSelect('conversations.recipient', 'recipient')
      .getMany();
  }

  async findDefault(id: number) {
    const conversations = await this.conversationRepository
      .createQueryBuilder('conversations')
      .select('conversations')
      .leftJoin('conversations.creator', 'creator')
      .addSelect([
        'creator.id',
        'creator.email',
        'creator.lastName',
        'creator.firstName',
      ])
      .leftJoin('conversations.recipient', 'recipient')
      .addSelect([
        'recipient.id',
        'recipient.email',
        'recipient.lastName',
        'recipient.firstName',
      ])
      .leftJoinAndSelect('conversations.lastMessageSent', 'lastSent')
      .leftJoin('lastSent.author', 'author')
      .addSelect(['author.id', 'author.lastName', 'author.firstName'])
      .where('creator.id = (:id)', { id })
      .orWhere('recipient.id = (:id)', { id })

      .limit(2)
      .getMany();
    return conversations;
  }

  async getConversationById(id: number) {
    return this.conversationRepository
      .createQueryBuilder('conversations')
      .where('conversations.id = (:id)', { id })
      .leftJoin('conversations.creator', 'creator')
      .addSelect([
        'creator.id',
        'creator.email',
        'creator.lastName',
        'creator.firstName',
      ])
      .leftJoin('conversations.recipient', 'recipient')
      .addSelect([
        'recipient.id',
        'recipient.email',
        'recipient.lastName',
        'recipient.firstName',
      ])
      .leftJoinAndSelect('conversations.lastMessageSent', 'lastSent')
      .leftJoin('lastSent.author', 'author')
      .addSelect(['author.id', 'author.lastName', 'author.firstName'])
      .leftJoinAndSelect('conversations.message', 'message')
      .orderBy('message.created_at', 'ASC')
      .leftJoin('message.author', 'authorSingle')
      .addSelect([
        'authorSingle.id',
        'authorSingle.lastName',
        'authorSingle.firstName',
      ])
      .getOne();
  }

  async createConversations(user: User, params: CreateConversationParams) {
    const { recipientId } = params;
    const userDB = await this.userService.findUser({ id: user.id });

    const recipient = await this.userService.findUser({ id: recipientId });
    if (!recipient)
      throw new HttpException(
        'Recipient is not found ',
        HttpStatus.BAD_REQUEST,
      );

    const conversationsCreator = await this.conversationRepository
      .createQueryBuilder('conversations')
      .select('conversations')
      .leftJoin('conversations.creator', 'creator')
      .leftJoin('conversations.recipient', 'recipient')
      .where('creator.id in (:id)', { id: [user.id, recipientId] })
      .andWhere('recipient.id in (:id)', { id: [user.id, recipientId] })
      .getMany();
    if (conversationsCreator.length !== 0) {
      console.log(conversationsCreator);
      throw new HttpException(
        'Conversation already exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const conversation = await this.conversationRepository.create({
      creator: userDB,
      recipient: recipient,
      // createdAt: Date.now(),
    });
    return await this.conversationRepository.save(conversation);
  }

  async updateConversation(conversation: Conversation) {
    return await this.conversationRepository.save(conversation);
  }
  async setLastMessage(lastMessage: Message) {
    const conversation = await this.conversationRepository.findOne({
      id: lastMessage.conversation.id,
    });
    conversation.lastMessageSent = lastMessage;
    return await this.updateConversation(conversation);
  }
}
