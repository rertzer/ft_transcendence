import { Module } from "@nestjs/common";
import { MyGateway } from "./gateway.service";

@Module({
	providers: [MyGateway]
})
export class GatewayModule{}
