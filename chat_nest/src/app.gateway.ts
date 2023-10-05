import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AppService } from './app.service';
import { PrismaClient } from '@prisma/client';


@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway {
	constructor (private appservice: AppService) {}

	@WebSocketGateway() server: Server;

  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, payload: any): string {
    await this.appservice.createMessage(payload);
  }
}
