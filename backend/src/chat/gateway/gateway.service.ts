import { OnModuleInit, Injectable } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway, MessageBody, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io'
import {createUser } from "../../prisma/chat/prisma.chat.test";
import {addChat, RetrievePrivateMessage, addPrivateMessage,getIdOfLogin, addChatMessage, addChanelUser, RetrieveChatMessage, findUser } from "../../prisma/chat/prisma.chat.service";
import {checkChatId, checkLogin} from "../../prisma/chat/prisma.chat.check";
import { getDate } from "../utils/utils.service";
import { encodePassword, checkPassword } from "../password/password.service";
import { JoinChatService } from "../joinChat/joinChat.service";
import { RetrieveMessageService } from "../retrieveMessage/retrieveMessage.service";
let lastMessageId = 0;

createUser()
@WebSocketGateway({
	cors: {
		origin: '*'
	}
})
//implements mean that it will contains the metho onModuleInit and will be executed
// the init of my gatewAY

@Injectable()
export class MyGateway implements OnModuleInit {

	@WebSocketServer()
	server: Server;

	getWebsocketServer() {
		return this.server;
	}

	onModuleInit() {
		this.server.on('connection', (socket) => {
			console.log(socket.id);
			console.log('connected');
		})
	}

	@SubscribeMessage('newMessage')
	async onNewMessage(@MessageBody() messageData: {username: string, content: string, idOfChat: string}) {
		console.log(messageData);
		console.log('gateway side');
		console.log(messageData.idOfChat)
		lastMessageId++
		await addChatMessage(parseInt(messageData.idOfChat), messageData.username, messageData.content, getDate());
	}


	@SubscribeMessage('JoinChatRoom')
	async onJoinChatRoom(@MessageBody() messageData:{username: string, chat_id:string, user_role:string, passeword:string}) {
		const joinClass = new JoinChatService(this);
		joinClass.joinChat(messageData.username, messageData.chat_id, messageData.user_role, messageData.passeword);
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
		const messageReceived = await RetrievePrivateMessage(userAsked);
		messageReceived.forEach(element => {
			this.server.emit('onMailBox', {
				msg: 'all message',
				content: element.message,
				sender: element.sender.username,
			})
		});
	}

	@SubscribeMessage('createChat')
	async onCreateChat(@MessageBody() messageData: {username: string, chatName: string, chatType: string, chatPassword: string}) {
		const idOfUser = await getIdOfLogin(messageData.username);
		const encodedPassword = await encodePassword(messageData.chatPassword);
		console.log("encoded password : ", encodedPassword);
		console.log("id of user : ", idOfUser);
		if (idOfUser !== undefined)
		{
			const newChatId = await addChat(messageData.chatName, messageData.chatType,idOfUser,  encodedPassword );
			addChanelUser(newChatId, idOfUser, 'admin', getDate(), null);
			console.log("new chat : ", newChatId);
		}
	}

	@SubscribeMessage('retrieveMessage')
	async onRetrieveMessage(@MessageBody() messageData: {numberMsgToDisplay: number, chatId: string}) {
		console.log("in retrieve message : ", messageData);
		const RetrieveMessage = new RetrieveMessageService(this);
		RetrieveMessage.retrievePrivateMessage(messageData.chatId, messageData.numberMsgToDisplay);
	}
}

