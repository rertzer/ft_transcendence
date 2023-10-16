import { OnModuleInit } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway, MessageBody, WebSocketServer } from "@nestjs/websockets";
// import { PrismaService } from "src/prisma/prisma.service";
import { Socket } from "dgram";
import { Server } from 'socket.io'
import { Prisma, PrismaClient } from "@prisma/client";
import {createUser, checkChatId } from "src/prisma/prisma.test";


let lastMessageId = 0;

createUser()
@WebSocketGateway({
	cors: {
		origin: 'http://localhost:3000',
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
	onNewMessage(@MessageBody() messageData: {username: string, content: string}) {
		console.log(messageData);
		console.log('gateway side');
		lastMessageId++
		this.server.emit('onMessage', {
			msg: 'New message',
			content: messageData.content,
			username: messageData.username,
			id: lastMessageId
		})
	}
	@SubscribeMessage('JoinChatRoom')
	onJoinChatRoom(@MessageBody() messageData: {id: string}) {
		console.log(messageData);
		console.log('gateway side');
		this.server.emit('onJoinChatRoom', {
			msg: 'New message',
			id : messageData
		})
	}

}
