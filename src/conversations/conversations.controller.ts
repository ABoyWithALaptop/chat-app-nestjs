import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/utils/Guards';
import { IUserService } from 'src/users/user';
import { Routes, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators';
import { User } from 'src/utils/typeorm';
import { IConversationsService } from './conversations';
import { CreateConversation } from './dtos/CreateConversation.dto';

@Controller(Routes.CONVERSATIONS)
@UseGuards(AuthenticatedGuard)
export class ConversationsController {
  constructor(
    @Inject(Services.CONVERSATIONS)
    private readonly conversationsService: IConversationsService,
  ) {}
  @Post()
  async CreateNewConversations(
    @AuthUser() user: User,
    @Body() createConversationPayload: CreateConversation,
  ) {
    // console.log(userDB);
    return this.conversationsService.createConversations(
      user,
      createConversationPayload,
    );
  }
}
