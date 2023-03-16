import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
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
    private eventEmitter: EventEmitter2,
  ) {}
  @Post()
  async CreateNewConversations(
    @AuthUser() user: User,
    @Body() createConversationPayload: CreateConversation,
  ) {
    const conversations = await this.conversationsService.createConversations(
      user,
      createConversationPayload,
    );
    this.eventEmitter.emit('conversations.created', conversations);
    return conversations;
  }

  @Get()
  async getConversations(@AuthUser() user: User) {
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
