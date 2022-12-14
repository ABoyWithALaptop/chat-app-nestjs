import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Conversation } from './Conversation';
import { User } from './User';

@Entity({ name: 'message' })
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ name: 'created_at', type: 'bigint' })
  createdAt: number;

  @ManyToOne(() => User, (user) => user.message)
  author: User;

  @ManyToOne(() => Conversation, (conversation) => conversation.message)
  conversation: Conversation;
}
