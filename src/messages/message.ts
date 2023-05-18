import { Message, User } from 'src/utils/typeorm';
import {
  CreateConversationParams,
  createMessageParam,
  deleteMessageParams,
} from 'src/utils/types';

export interface IMessageService {
  createMessage(param: createMessageParam): Promise<Message>;
  getMessageByConversationId(
    conversationId: number,
    user: User,
  ): Promise<Message[]>;
  deleteMessage(param: deleteMessageParams);
  modifyMessageAndReturnFullInfo(message: Message);
}
