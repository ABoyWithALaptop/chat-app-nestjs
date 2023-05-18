import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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

  @Column('text')
  content: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: number;

  @ManyToOne(() => User, (user) => user.message)
  author: User;

  @ManyToOne(() => Conversation, (conversation) => conversation.message)
  conversation: Conversation;

  @DeleteDateColumn()
  deletedAt?: Date;
  @Column({ default: false })
  oneWayDelete: boolean;
  @Column({ default: false })
  twoWayDelete: boolean;
}
