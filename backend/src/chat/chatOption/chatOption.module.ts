import { GatewayModule } from "../gateway/gateway.module";
import { Module } from "@nestjs/common";
import { AdminController } from "./chatOption.controller";
import { ChatModule } from "../chat.module";
import { MutedUserService } from "../mutedUser/mutedUser.service";

@Module({
	controllers: [AdminController],
	providers: [MutedUserService]
})

export class AdminModule{}
