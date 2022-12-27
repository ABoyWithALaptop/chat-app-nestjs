import { Message, User } from 'src/utils/typeorm';
import { CreateConversationParams, createMessageParam } from 'src/utils/types';

export interface IMessageService {
  createMessage(param: createMessageParam): Promise<Message>;
  getMessageByConversationId(conversationId: number): Promise<Message[]>;
  firstSentMessage(
    user: User,
    params: CreateConversationParams,
  ): Promise<Message>;
}
