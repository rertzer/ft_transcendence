import { GatewayModule } from "../gateway/gateway.module";
import { Module } from "@nestjs/common";
import { ChatOptController } from "./chatOption.controller";
import { ChatModule } from "../chat.module";
import { MutedUserService } from "../mutedUser/mutedUser.service";
import { MutedUserModule } from "../mutedUser/mutedUser.module";
import { JoinChatService } from "../joinChat/joinChat.service";
import { MyGateway } from "../gateway/gateway.service";

@Module({
	imports:[GatewayModule],
	controllers: [ChatOptController],
	providers: [JoinChatService]
})

export class ChatOptModule{}
