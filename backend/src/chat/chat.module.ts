import { Module } from '@nestjs/common';
import { JoinChatService } from './joinChat/joinChat.service';
import { MyGateway } from './gateway/gateway.service';
import { RetrieveMessageService } from './retrieveMessage/retrieveMessage.service';

@Module({
  providers: [MyGateway, ],
  exports: [MyGateway],
})
export class ChatModule {}
