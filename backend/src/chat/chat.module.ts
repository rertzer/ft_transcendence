import { Module } from '@nestjs/common';
import { JoinChatService } from './joinChat/joinChat.service';
import { MyGateway } from './gateway/gateway.service';

@Module({
  providers: [JoinChatService, MyGateway],
  exports: [JoinChatService, MyGateway],
})
export class ChatModule {}
