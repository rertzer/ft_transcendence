import { GatewayModule } from "../gateway/gateway.module";
import { Module } from "@nestjs/common";
import { ChatOptController } from "./chatOption.controller";
import { ChatModule } from "../chat.module";
import { MutedUserService } from "../mutedUser/mutedUser.service";
import { MutedUserModule } from "../mutedUser/mutedUser.module";

@Module({
	imports:[],
	controllers: [ChatOptController],
	providers: [MutedUserService]
})

export class ChatOptModule{}
