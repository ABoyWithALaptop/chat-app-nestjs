import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Conversation } from './Conversation';
import { Message } from './Message';

@Entity({ name: 'users' })
export class User {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ select: false })
  @Exclude()
  password: string;

  @OneToMany(() => Message, (message) => message.author, {
    cascade: ['insert', 'update', 'remove'],
  })
  @JoinColumn()
  message: Message[];

  @OneToMany(() => Conversation, (conversation) => conversation.creator, {
    cascade: ['insert', 'remove'],
  })
  conversationCreated: Conversation[];
  @OneToMany(() => Conversation, (conversation) => conversation.recipient, {
    cascade: ['insert', 'remove'],
  })
  conversationReceived: Conversation[];
  toJSON() {
    delete this.password;
    return this;
  }
}
