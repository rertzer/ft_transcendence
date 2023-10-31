import { OnModuleInit, Injectable, NestHybridApplicationOptions } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway, MessageBody, WebSocketServer,ConnectedSocket } from "@nestjs/websockets";
import { Server } from 'socket.io'
import { PrismaChatService } from "src/prisma/chat/prisma.chat.service";
import { getDate } from "../utils/utils.service";
import { encodePassword, checkPassword } from "../password/password.service";
import { JoinChatService } from "../joinChat/joinChat.service";
import { RetrieveMessageService } from "../retrieveMessage/retrieveMessage.service";
import {ChatLister} from "../chatLister/chatLister.service";
import { Socket } from "socket.io";
import { CreateChatService } from "../createchat/createchat.service";
import { MutedUserService } from "../mutedUser/mutedUser.service";
import { subscribe } from "diagnostics_channel";

let lastMessageId = 0;


@WebSocketGateway({
	cors: {
		origin: '*'
	},
})

//implements mean that it will contains the metho onModuleInit and will be executed
// the init of my gatewAY

@Injectable()
export class MyGateway {

	constructor (private readonly mutedUserService: MutedUserService, private prismaChatService: PrismaChatService){}
	private sockets: Socket[] = [];

	@WebSocketServer()
	server: Server;

	handleConnection(client:Socket){
		console.log(`Client connected: ${client.id}`);
		this.sockets.push(client);

		client.on('disconnect', () => {
			//console.log(`Client disconnected ${client.id}`);
			this.sockets = this.sockets.filter((s) => {return s != client;});
		})
	}

	getWebsocketServer() {
		return this.server;
	}

	findSocketByUsername(username: string): Socket | undefined {
		return this.sockets.find((socket) => {
		  // Implement your logic to match the socket with the given username
		  // For example: return socket.username === username;
		});
	}

	@SubscribeMessage('newMessage')
	async onNewMessage(@MessageBody() messageData: {username: string, content: string, idOfChat: number}, @ConnectedSocket() client:Socket) {
		//console.log(messageData);
		//console.log('gateway side');
		//console.log(messageData.idOfChat)
		if (!this.mutedUserService.IsMutedUser(messageData.username, messageData.idOfChat))
		{
			const targetSocket = this.sockets.find((socket) => socket === client);
			if (targetSocket !== undefined)
			{
				lastMessageId++; // probleme with that in multi client. need to have an increment front end
				//console.log("found a socket")
				//console.log("id of chat : ", messageData.idOfChat.toString())
				this.server.to(messageData.idOfChat.toString()).emit('newMessage', {
					msg: messageData.content,
					username: messageData.username,
					date: getDate(),
					id: lastMessageId,
					idOfChat: messageData.idOfChat
				});
				await this.prismaChatService.addChatMessage(messageData.idOfChat, messageData.username, messageData.content, getDate());
			}
		}
	}


	@SubscribeMessage('JoinChatRoom')
	async onJoinChatRoom(@MessageBody() messageData:{username: string, chat_id:string, user_role:string, passeword:string}, @ConnectedSocket() client:Socket) {
		const targetSocket = this.sockets.find((socket) => socket === client);
		if (targetSocket !== undefined)
		{
			const joinClass = new JoinChatService(this.prismaChatService);
			joinClass.joinChat(messageData.username, messageData.chat_id, messageData.user_role, messageData.passeword, targetSocket);
		}
	}

	@SubscribeMessage('SendPrivateMessage')
	async onSendMessage(@MessageBody() messageData: {msg: string, loginToSend: string, idOfUser: string}, @ConnectedSocket() client:Socket) {
		//console.log(messageData);
		const targetSocket = this.sockets.find((socket) => socket === client);
		if (targetSocket !== undefined)
		{
			const userExist = await this.prismaChatService.checkLogin(messageData.loginToSend);
			if (userExist === false) {
				//console.log("User asked have not been found")
				targetSocket.emit('onSendMessage', {
					id : '-1'
				});
				return;
			}
			else {
				const idToSend = await this.prismaChatService.getIdOfLogin(messageData.loginToSend);
				const idOfSender = await this.prismaChatService.getIdOfLogin(messageData.idOfUser);
				//console.log("id to send = ", idToSend, "id of sender = ", idOfSender);
				if (idOfSender !== undefined && idToSend !== undefined)
					this.prismaChatService.addPrivateMessage(idOfSender, idToSend, messageData.msg);
			}
		}
	}

	@SubscribeMessage('onUserConnection')
	async onUserConnection(@MessageBody() TokenConnection: string, @ConnectedSocket() client:Socket) {
		//console.log("Token receive to try to connect : ",TokenConnection);
		const targetSocket = this.sockets.find((socket) => socket === client);
		if (targetSocket !== undefined)
		{
			const userExist:boolean = await this.prismaChatService.checkLogin(TokenConnection);
			if (userExist == false) {
				//console.log("User asked have not been found")
				targetSocket.emit('onUserConnection', {
					id : '-1'
				});
				return;
			}
			else {
				//console.log("User asked have been found");
				targetSocket.emit('onUserConnection', {
					id : 'good',
					username: TokenConnection
				});
				return;
			}
		}
	}

	@SubscribeMessage('createChat')
	async onCreateChat(@MessageBody() messageData: {username: string, chatName: string, chatType: string, chatPassword: string}, @ConnectedSocket() client:Socket) {
		const targetSocket = this.sockets.find((socket) => socket === client);
		if (targetSocket !== undefined)
		{
			const CreateRoom = new CreateChatService(this.prismaChatService);
			CreateRoom.createChat(messageData.username, messageData.chatPassword, messageData.chatName, messageData.chatType, targetSocket);
		}
	}

	@SubscribeMessage('retrieveMessage')
	async onRetrieveMessage(@MessageBody() messageData: {numberMsgToDisplay: number, chatId: number}, @ConnectedSocket() client:Socket) {
		//console.log("in retrieve message : ", messageData);
		const targetSocket = this.sockets.find((socket) => socket === client);
		if (targetSocket !== undefined)
		{
			//console.log("found a socket")
			const RetrieveMessage = new RetrieveMessageService(this.prismaChatService);
			RetrieveMessage.retrieveMessage(messageData.chatId, messageData.numberMsgToDisplay, targetSocket);
		}
	}

	@SubscribeMessage('mutedUser')
	mutedUser(@MessageBody() user:{username:string, chatId: number, time: number}, @ConnectedSocket() client:Socket) {
		const userIsMute = this.mutedUserService.addMutedUser({username: user.username, chatId: user.chatId, timeStart: getDate(), duration: user.time});
		//console.log("user is muted pls : ", userIsMute);
		if (!userIsMute)
		{
			client.emit("userIsMute",userIsMute );
		}
	}

	@SubscribeMessage('chatList')
	async onChatList(@MessageBody() username: string, @ConnectedSocket() client:Socket) {
		const targetSocket = this.sockets.find((socket) => socket === client);
		if (targetSocket !== undefined)
		{
			//console.log("username receive : ", username)
			const chatLister = new ChatLister(this.prismaChatService);
			chatLister.listChatOfUser(username, targetSocket);
		}
	}
}


