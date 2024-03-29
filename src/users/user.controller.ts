import { Controller, Post, Body, Get } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { instanceToPlain } from 'class-transformer';
import { AuthenticatedGuard } from 'src/auth/utils/Guards';
import { Routes, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators';
import { User } from 'src/utils/typeorm';
import { findAllUserDto } from './dtos/FindAllUser.dto';
import { IUserService } from './user';

@Controller(Routes.USERS)
export class UserController {
  constructor(
    @Inject(Services.USERS) private readonly userService: IUserService,
  ) {}

  @Post('/')
  @UseGuards(AuthenticatedGuard)
  async searchUser(@Body() body: findAllUserDto, @AuthUser() user: User) {
    const res = (
      await this.userService.findAllUsersWithConditions(body)
    ).filter((elseUser) => elseUser.id != user.id);
    return instanceToPlain(res);
    // return this.userService.findUser();
  }
  @Get('/availableUsers')
  @UseGuards(AuthenticatedGuard)
  async getUserInfo(@AuthUser() user: User) {
    const availableUsers = await this.userService.findAvailableUsers(user);
    const simpleResult = availableUsers.map((user) => {
      const { id, ...result } = instanceToPlain(user);
      return result;
    });
    return simpleResult;
    // return instanceToPlain(user);
  }
}
