import { OnModuleInit } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway, MessageBody, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io'
import { Prisma, PrismaClient } from "@prisma/client";
import {createUser } from "../prisma/prisma.test";
import { checkChatId, checkLogin, RetrieveMessage, addPrivateMessage,getIdOfLogin } from "../prisma/prisma.service";
import { arrayBuffer } from "stream/consumers";

let lastMessageId = 0;

createUser()
@WebSocketGateway({
	cors: {
		origin: '*'
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
	async onJoinChatRoom(@MessageBody() messageData: string) {
		console.log("message receive : ", messageData);
		console.log('gateway side');
		const chatExist = await checkChatId(parseInt(messageData));
		if (chatExist === false) {
			console.log("Chat asked have not been found")
			this.server.emit('onJoinChatRoom', {
				id : '-1'
			});
			return;
		}
		console.log("Chat asked have been found");
		this.server.emit('onJoinChatRoom', {
			msg: 'New message',
			id : messageData
		})
	}

	@SubscribeMessage('SendPrivateMessage')
	async onSendMessage(@MessageBody() messageData: {msg: string, loginToSend: string, idOfUser: string}) {
		console.log(messageData);
		const userExist = await checkLogin(messageData.loginToSend);
		if (userExist === false) {
			console.log("User asked have not been found")
			this.server.emit('onSendMessage', {
				id : '-1'
			});
			return;
		}
		else {
			const idToSend = await getIdOfLogin(messageData.loginToSend);
			const idOfSender = await getIdOfLogin(messageData.idOfUser);
			console.log("id to send = ", idToSend, "id of sender = ", idOfSender);
			if (idOfSender !== undefined && idToSend !== undefined)
				addPrivateMessage(idOfSender, idToSend, messageData.msg);
		}
	}

	@SubscribeMessage('onUserConnection')
	async onUserConnection(@MessageBody() TokenConnection: string) {
		console.log("Token receive to try to connect : ",TokenConnection);
		const userExist:boolean = await checkLogin(TokenConnection);
		if (userExist == false) {
			console.log("User asked have not been found")
			this.server.emit('onUserConnection', {
				id : '-1'
			});
			return;
		}
		else {
			console.log("User asked have been found");
			this.server.emit('onUserConnection', {
				id : 'good',
				username: TokenConnection
			});
			return;
		}
	}

	@SubscribeMessage('onMailBox')
	async onMailBox(@MessageBody() userAsked: string) {
		console.log('in mail box');
		const messageReceived = await RetrieveMessage(userAsked);
		messageReceived.forEach(element => {
			this.server.emit('onMailBox', {
				msg: 'all message',
				content: element.message,
				sender: element.sender.username,
			})
		});
	}
}

