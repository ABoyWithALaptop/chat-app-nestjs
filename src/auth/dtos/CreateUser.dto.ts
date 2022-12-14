import { IsEmail, isNotEmpty, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MaxLength(32)
  firstName: string;

  @IsNotEmpty()
  @MaxLength(32)
  lastName: string;

  @IsNotEmpty()
  @MaxLength(32)
  passWord: string;
}
