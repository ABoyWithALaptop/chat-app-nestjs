import { Body, Controller, Inject, Post } from '@nestjs/common';
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
}
