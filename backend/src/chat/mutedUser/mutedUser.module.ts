import { GatewayModule } from "../gateway/gateway.module";
import { Module } from "@nestjs/common";
import { MutedUserService } from "./mutedUser.service";
import { ChatModule } from "../chat.module";

@Module({
	imports: [ChatModule],
	providers: [MutedUserService],
	exports: [MutedUserService],
})

export class MutedUserModule{}

