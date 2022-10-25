import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
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
    return this.conversationsService.createConversations(
      user,
      createConversationPayload,
    );
  }

  @Get()
  async getConversations(@AuthUser() user: User) {
    // const { conversations } = await this.conversationsService.findDefault(
    //   user.participant.id,
    // );
    // return conversations;
    return this.conversationsService.findDefault(user.id);
  }

  @Get('/all')
  getAllConversation() {
    return this.conversationsService.findAll();
  }

  @Get(':id')
  getConversationById(@Param('id') id: number) {
    return this.conversationsService.getConversationById(id);
  }
}
