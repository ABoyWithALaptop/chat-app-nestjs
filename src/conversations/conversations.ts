import { Conversation, User } from 'src/utils/typeorm';
import { CreateConversationParams } from 'src/utils/types';

export interface IConversationsService {
  createConversations(user: User, conversationParams: CreateConversationParams);
  findDefault(id: number): Promise<Conversation[]>;
  findAll(): Promise<Conversation[]>;
  getConversationById(id: number): Promise<Conversation>;
}
