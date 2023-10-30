import { Module } from '@nestjs/common';
import { JoinChatService } from './joinChat/joinChat.service';
import { MyGateway } from './gateway/gateway.service';
import { RetrieveMessageService } from './retrieveMessage/retrieveMessage.service';
import { MutedUserService } from './mutedUser/mutedUser.service';

@Module({
  providers: [MyGateway, MutedUserService],
  exports: [MyGateway],
})
export class ChatModule {}
