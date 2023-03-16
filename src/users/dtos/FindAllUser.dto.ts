import { IsEmail, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class findAllUserDto {
  @ValidateIf((o) => o.firstName)
  @IsString()
  firstName: string;

  @ValidateIf((o) => o.lastName)
  @IsString()
  lastName: string;

  @ValidateIf((o) => o.email != undefined || null)
  // @IsNotEmpty()
  @IsEmail()
  email: string;
}
