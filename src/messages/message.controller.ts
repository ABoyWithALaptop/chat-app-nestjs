import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes/parse-int.pipe';
import { EventEmitter2 } from '@nestjs/event-emitter';
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
    private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async createMessage(
    @Body() createMessagePayload: createMessageDto,
    @AuthUser() user: User,
  ) {
    const msg = await this.messageService.createMessage({
      ...createMessagePayload,
      user,
    });
    this.eventEmitter.emit('message.created', msg);
    return;
  }

  @Get(':conversationId')
  async getMessageFromConversation(
    @AuthUser() user: User,
    @Param('conversationId', ParseIntPipe) conversationId: number,
  ) {
    const messages = await this.messageService.getMessageByConversationId(
      conversationId,
    );
    return {
      conversationId: conversationId,
      messages: messages,
    };
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
