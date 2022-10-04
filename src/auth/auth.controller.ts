import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { IUserService } from 'src/users/user';
import { Routes, Services } from 'src/utils/constants';
import { IAuthService } from './auth';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { UserLoginDto } from './dtos/UserLogin.dto';
import { LocalAuthGuard } from './utils/Guards';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.AUTH) private authService: IAuthService,
    @Inject(Services.USERS) private userService: IUserService,
  ) {}

  @Post('register')
  // @UseInterceptors(ClassSerializerInterceptor)
  async registerUser(@Body() createUserDto: CreateUserDto) {
    // console.log(createUserDto);
    const user = await this.userService.createUser(createUserDto);
    if (!user) {
      throw new HttpException('User already exists', HttpStatus.NOT_ACCEPTABLE);
    }
    return instanceToPlain(user);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  loginUser(@Body() userLoginDto: UserLoginDto) {}

  @Get('status')
  status() {}

  @Post('logout')
  logout() {}
}
