import { User } from './typeorm';

export type CreateUserDetails = {
  email: string;
  passWord: string;
  firstName: string;
  lastName: string;
};

export type validateUserDetails = {
  email: string;
  password: string;
};

export type findUserParams = Partial<{
  id: number;
  email?: string;
}>;

export type CreateConversationParams = {
  recipientId: number;
  message: string;
};

export type FindParticipantParams = Partial<{
  id: number;
}>;

export interface AuthenticatedRequest extends Request {
  user: User;
}

export type CreateParticipantParams = {
  id: number;
};

export type createMessageParam = {
  content: string;
  conversationId: number;
  user: User;
};
