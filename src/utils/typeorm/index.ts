import { Conversation } from './entities/Conversation';
import { Participant } from './entities/Participant';
import { Session } from './entities/Session';
import { User } from './entities/User';

const entities = [User, Session, Conversation, Participant];
export default entities;
export { User, Session, Conversation, Participant };
