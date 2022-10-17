import { IsEmpty, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateConversation {
  @IsNumber()
  @IsNotEmpty()
  recipientId: number;

  @IsNumber()
  @IsNotEmpty()
  authorId: number;

  @IsString()
  @IsNotEmpty()
  message: string;
}
