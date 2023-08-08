import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes/parse-int.pipe';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Routes, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators';
import { User } from 'src/utils/typeorm';
import { createMessageDto } from './dtos/CreateMessage.dto';
import { IMessageService } from './message';
import { AuthenticatedGuard } from 'src/auth/utils/Guards';

@UseGuards(AuthenticatedGuard)
@Controller(Routes.MESSAGES)
export class MessageController {
  constructor(
    @Inject(Services.MESSAGES) private readonly messageService: IMessageService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async createMessage(
    @Param('id', ParseIntPipe) conversationId: number,
    @AuthUser() user: User,
    @Body() { content }: createMessageDto,
  ) {
    const params = { user, content, conversationId };
    const msg = await this.messageService.createMessage(params);
    this.eventEmitter.emit('message.created', msg);
    return;
  }

  @Delete(':messageId')
  async deleteMessageFormConversation(
    @Param('messageId', ParseIntPipe) messageId: number,
    @AuthUser() user: User,
  ) {
    try {
      console.log('messageId', messageId);
      return await this.messageService.deleteMessage({ messageId, user });
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  @Get('')
  async getMessageFromConversation(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) conversationId: number,
  ) {
    console.log('conversationId', conversationId);
    const messages = await this.messageService.getMessageByConversationId(
      conversationId,
      user,
    );
    return {
      conversationId: conversationId,
      messages: messages,
    };
  }
}
