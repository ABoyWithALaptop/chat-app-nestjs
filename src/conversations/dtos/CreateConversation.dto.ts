import { IsEmpty, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateConversation {
  @IsNumber()
  @IsNotEmpty()
  recipientId: number;

  @IsString()
  // @IsNotEmpty()
  message: string;
}
