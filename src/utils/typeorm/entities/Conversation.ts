import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Message } from './Message';
import { User } from './User';

@Entity({ name: 'conversations' })
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.conversationCreated)
  creator: User;

  @ManyToOne(() => User, (user) => user.conversationReceived)
  recipient: User;

  @OneToMany(() => Message, (mess) => mess.conversation, {
    cascade: ['insert', 'update', 'remove'],
  })
  @JoinColumn()
  message: Message[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: number;

  @OneToOne(() => Message)
  @JoinColumn({ name: 'last_message_sent' })
  lastMessageSent: Message;
}
