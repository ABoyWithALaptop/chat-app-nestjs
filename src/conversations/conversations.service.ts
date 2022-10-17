import { Injectable } from '@nestjs/common';
import { CreateConversationParams } from 'src/utils/types';
import { IConversationsService } from './conversations';

@Injectable()
export class ConversationsService implements IConversationsService {
  constructor() {}
  createConversations(params: CreateConversationParams) {}
}
