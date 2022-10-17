import { CreateConversationParams } from 'src/utils/types';

export interface IConversationsService {
  createConversations(conversationParams: CreateConversationParams);
}
