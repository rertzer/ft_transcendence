import { GatewayModule } from "../gateway/gateway.module";
import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { ChatModule } from "../chat.module";

@Module({
	controllers: [AdminController],
})

export class AdminModule{}
