import { User } from 'src/utils/typeorm';
import { CreateConversationParams } from 'src/utils/types';

export interface IConversationsService {
  createConversations(user: User, conversationParams: CreateConversationParams);
}
