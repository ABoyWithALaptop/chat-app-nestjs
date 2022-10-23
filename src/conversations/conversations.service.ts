import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IParticipantsService } from 'src/participants/participants';
import { IUserService } from 'src/users/user';
import { Services } from 'src/utils/constants';
import { Conversation, Participant, User } from 'src/utils/typeorm';
import { CreateConversationParams } from 'src/utils/types';
import { Repository } from 'typeorm';
import { IConversationsService } from './conversations';

@Injectable()
export class ConversationsService implements IConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @Inject(Services.PARTICIPANTS)
    private readonly participantsService: IParticipantsService,
    @Inject(Services.USERS)
    private readonly userService: IUserService,
  ) {}

  async createConversations(user: User, params: CreateConversationParams) {
    const { authorId, recipientId } = params;
    const participants: Participant[] = [];
    const userDB = await this.userService.findUser({ id: user.id });
    if (!userDB.participant) {
      const participant = await this.createParticipantAndSaveUser(
        user,
        authorId,
      );
      participants.push(participant);
    } else participants.push(userDB.participant);

    const recipient = await this.userService.findUser({ id: recipientId });
    if (!recipient)
      throw new HttpException(
        'Recipient is not found ',
        HttpStatus.BAD_REQUEST,
      );
    if (!recipient.participant) {
      const participant = await this.createParticipantAndSaveUser(
        recipient,
        recipientId,
      );
      participants.push(participant);
    } else participants.push(recipient.participant);

    const conversation = await this.conversationRepository.create({
      participants,
    });
    return this.conversationRepository.save(conversation);
  }

  private async createParticipantAndSaveUser(user: User, id: number) {
    const participant = await this.participantsService.createParticipant({
      id,
    });
    user.participant = participant;
    await this.userService.saveUser(user);
    return participant;
  }
}
