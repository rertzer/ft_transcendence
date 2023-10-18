import { OnModuleInit } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway, MessageBody, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io'
import { Prisma, PrismaClient } from "@prisma/client";
import {createUser } from "../prisma/prisma.test";
import {checkChatId, checkLogin, RetrieveMessage, addPrivateMessage,getIdOfLogin, addChatMessage, addChanelUser } from "../prisma/prisma.service";
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
	onNewMessage(@MessageBody() messageData: {username: string, content: string, idOfChat: number}) {
		console.log(messageData);
		console.log('gateway side');
		lastMessageId++
		addChatMessage(messageData.idOfChat, messageData.username, messageData.content);
	}


	@SubscribeMessage('JoinChatRoom')
	async onJoinChatRoom(@MessageBody() messageData:{username: string, id:string, user_role:string}) {
		console.log("message receive : ", messageData);
		console.log('gateway side');
		const chatExist = await checkChatId(parseInt(messageData.id));
		if (chatExist === false) {
			console.log("Chat asked have not been found")
			this.server.emit('onJoinChatRoom', {
				id : '-1'
			});
			return;
		}
		const userId = await getIdOfLogin(messageData.username);
		//need to check if the user is already in the chat
		//if not then :
		if (userId !== undefined)
		{
			addChanelUser(parseInt(messageData.id),userId, messageData.user_role, new Date(Date.now()), null);
			console.log("Chat asked have been found");
			this.server.emit('onJoinChatRoom', {
				msg: 'New message',
				id : messageData
			})
		}
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

