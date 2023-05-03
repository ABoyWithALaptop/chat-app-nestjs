import { IsEmpty, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateConversation {
  @IsString()
  @IsNotEmpty()
  recipientEmail: string;

  @IsString()
  // @IsNotEmpty()
  message: string;
}
