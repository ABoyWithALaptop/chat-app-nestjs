import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { CreateConversation } from 'src/conversations/dtos/CreateConversation.dto';
import { Routes, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators';
import { User } from 'src/utils/typeorm';
import { createMessageDto } from './dtos/CreateMessage.dto';
import { IMessageService } from './message';

@Controller(Routes.MESSAGES)
export class MessageController {
  constructor(
    @Inject(Services.MESSAGES) private readonly messageService: IMessageService,
  ) {}

  @Post()
  createMessage(
    @Body() createMessagePayload: createMessageDto,
    @AuthUser() user: User,
  ) {
    return this.messageService.createMessage({ ...createMessagePayload, user });
  }

  @Get(':conversationId')
  getMessageFromConversation(
    @AuthUser() user: User,
    @Param('conversationId') conversationId: number,
  ) {
    return this.messageService.getMessageByConversationId(conversationId);
  }

  @Post('/firstMessage')
  async firstSendMessage(
    @AuthUser() user: User,
    @Body() createConversationPayload: CreateConversation,
  ) {
    return await this.messageService.firstSentMessage(
      user,
      createConversationPayload,
    );
  }
}
