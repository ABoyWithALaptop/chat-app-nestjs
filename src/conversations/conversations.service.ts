import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserService } from 'src/users/user';
import { Services } from 'src/utils/constants';
import { Conversation, User } from 'src/utils/typeorm';
import { CreateConversationParams } from 'src/utils/types';
import { Repository } from 'typeorm';
import { IConversationsService } from './conversations';

@Injectable()
export class ConversationsService implements IConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @Inject(Services.USERS)
    private readonly userService: IUserService,
  ) {}

  async findAll() {
    return await this.conversationRepository
      .createQueryBuilder('conversations')
      .getMany();
  }

  async findDefault(id: number) {
    const conversations = await this.conversationRepository
      .createQueryBuilder('conversations')
      .select('conversations')
      .leftJoinAndSelect('conversations.creator', 'creator')
      .leftJoinAndSelect('conversations.recipient', 'recipient')
      .where('creator.id = (:id)', { id })
      .orWhere('recipient.id = (:id)', { id })
      .limit(2)
      .getMany();
    return conversations;
  }

  async getConversationById(id: number) {
    return this.conversationRepository.findOne(id);
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
    if (conversationsCreator) {
      console.log(conversationsCreator);
      throw new HttpException(
        'Conversation already exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const conversation = await this.conversationRepository.create({
      creator: userDB,
      recipient: recipient,
    });
    return await this.conversationRepository.save(conversation);
  }
}
