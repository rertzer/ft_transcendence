import { OnModuleInit } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway, MessageBody, WebSocketServer } from "@nestjs/websockets";
import { Socket } from "dgram";
import { Server } from 'socket.io'

@WebSocketGateway({
	cors: {
		origin: '*',
	}
})
//implements mean that it will contains the metho onModuleInit and will be executed
// the init of my gatewAY
export class MyGateway implements OnModuleInit {

	@WebSocketServer()
	server: Server;

	onModuleInit() {
		this.server.on('connection', (socket) => {
			console.log(socket.id);
			console.log('connected');
		})
	}
	@SubscribeMessage('newMessage')
	onNewMessage(@MessageBody() body: any) {
		console.log(body);
		console.log('gateway side');
		this.server.emit('onMessage', {
			msg: 'New message',
			content: body,
		})
	}
}
