import { Module } from "@nestjs/common";
import { MyGateway } from "./gateway.service";
import { JoinChatModule } from "../joinChat/joinChat.module";
import { forwardRef } from "@nestjs/common";
import { ChatModule } from "../chat.module";

@Module({
	imports : [ChatModule],
	providers: [MyGateway],
	exports: [MyGateway],
})
export class GatewayModule{}
