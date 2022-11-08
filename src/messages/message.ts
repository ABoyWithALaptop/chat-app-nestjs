import { Message } from 'src/utils/typeorm';
import { createMessageParam } from 'src/utils/types';

export interface IMessageService {
  createMessage(param: createMessageParam): Promise<Message>;
}
