import { Conversation, Message, User } from 'src/utils/typeorm';
import { CreateConversationParams } from 'src/utils/types';

export interface IConversationsService {
  createConversations(
    user: User,
    conversationParams: CreateConversationParams,
  ): Promise<Conversation>;
  findDefault(id: number): Promise<Conversation[]>;
  findAll(): Promise<Conversation[]>;
  getConversationById(id: number): Promise<Conversation>;
  updateConversation(conversation: Conversation): Promise<Conversation>;
  setLastMessage(lastMessage: Message): Promise<Conversation>;
}
