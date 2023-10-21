import { OnModuleInit } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway, MessageBody, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io'
import {createUser } from "../prisma/prisma.test";
import {addChat, RetrievePrivateMessage, addPrivateMessage,getIdOfLogin, addChatMessage, addChanelUser, RetrieveChatMessage, findUser } from "../prisma/prisma.service";
import {checkChatId, checkLogin} from "../prisma/prisma.check";
import { getDate } from "../utils/utils.service";
import { encodePassword, checkPassword } from "../password/password.service";
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
	onNewMessage(@MessageBody() messageData: {username: string, content: string, idOfChat: string}) {
		console.log(messageData);
		console.log('gateway side');
		console.log(messageData.idOfChat)
		lastMessageId++
		addChatMessage(parseInt(messageData.idOfChat), messageData.username, messageData.content, getDate());
	}


	@SubscribeMessage('JoinChatRoom')
	async onJoinChatRoom(@MessageBody() messageData:{username: string, chat_id:string, user_role:string}) {
		console.log("message receive : ", messageData);
		console.log('gateway side');
		console.log(messageData.chat_id)
		getDate();
		Date.now();
		if (Number.isNaN(parseInt(messageData.chat_id)))
		{
			console.log("Chat asked is not a number")
			this.server.emit('onJoinChatRoom', {
				id : '-1'
			});
			return;
		}
		console.log("chat id : ", parseInt(messageData.chat_id));
		const chatExist = await checkChatId(parseInt(messageData.chat_id));
		if (chatExist === false) {
			console.log("Chat asked have not been found")
			this.server.emit('onJoinChatRoom', {
				id : '-1'
			});
			return;
		}
		else {
			this.server.emit('onJoinChatRoom', {
				id : messageData.chat_id
			});
		}
		const userId = await getIdOfLogin(messageData.username);
		//need to check if the user is already in the chat
		//if not then :
		if (userId !== undefined)
		{
			// console.log("date now : ", new Date(Date.now())));
			addChanelUser(parseInt(messageData.chat_id),userId, messageData.user_role, getDate(), null);
			console.log("Chat asked have been found");
			this.server.emit('onJoinChatRoom', {
				msg: 'New message',
				id : messageData
			})
		}
		const messageReceived = await RetrieveChatMessage(parseInt(messageData.chat_id))
		if (messageReceived !== undefined)
		{
			for (const element of messageReceived) {
				const username = await findUser(element.chat_channels_user_id);
				this.server.emit('retrieveMessage', {
					msg: element.message,
					username: username,
					date: element.date_sent,
					id: element.id
				})
			};
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
			const newChat = await addChat(messageData.chatName, messageData.chatType,idOfUser,  encodedPassword );
			console.log("new chat : ", newChat);
		}
	}
}

