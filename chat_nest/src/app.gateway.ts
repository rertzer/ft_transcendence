// import {
//   SubscribeMessage,
//   WebSocketGateway,
//   OnGatewayInit,
//   WebSocketServer,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
// } from '@nestjs/websockets';
// import { Socket, Server } from 'socket.io';
// import { AppService } from './app.service';
// import { PrismaClient } from '@prisma/client';


// @WebSocketGateway({
//   cors: {
//     origin: '*',
//   },
// })
// export class AppGateway {
// 	constructor (private appservice: AppService) {}

// 	@WebSocketServer() server: Server;

//   @SubscribeMessage('sendMessage')
//   async handleMessage(client: Socket, payload: any): string {
//     await this.appservice.createMessage(payload);
// 	this.server.emit('recMessage', payload)
// 	}
// 	afterInit(server: Server) {
// 		console.log(server);
// 	}
// 	handleDisconnect(client: Socket) {
// 		console.log(`Disconnected: ${client.id}`);
// 	}
// 	handleConnection(client: Socket) {
// 		console.log(`Connected: ${client.id}`);
// 	}
// }
