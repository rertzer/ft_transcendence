import { Injectable } from "@nestjs/common";
import {MyGateway } from "../gateway/gateway.service";
import { PrismaChatService } from "src/prisma/chat/prisma.chat.service";
import { getDate } from "../utils/utils.service";
import { Socket } from "socket.io";
import { ChatType } from "src/prisma/chat/prisma.chat.service";


@Injectable()
export class JoinChatService{
	constructor(private prismaService:PrismaChatService ){
	}

	async joinChat(username: string, chat_id:string, user_role:string, passeword:string, sock : Socket)
	{
		//console.log("in join chat class");
		if (this.checkNumber(chat_id, sock) === -1)
			return;
		if (this.checkChatExist(chat_id, sock) === null)
			return;
		await this.addUserToChat(username, chat_id, user_role, passeword)
		//console.log("chat id in join chat : ", chat_id);
		sock.join(chat_id)
	}
	//async addUserToChat(username: string, chat_id:string, user_role:string, passeword:string)

	checkNumber(chat_id: string, sock : Socket) : Number
	{
		if (Number.isNaN(parseInt(chat_id)))
		{
			//console.log("Chat asked is not a number")
			sock.emit('onJoinChatRoom', {
				id : '-1'
			});
			return (-1)
		}
		return (0);
	}

	async checkChatExist(chat_id: string, sock : Socket) {
		const chatExist = await this.prismaService.checkChatId(parseInt(chat_id));
		if (chatExist == ChatType.NotExisting) {
			sock.emit('onJoinChatRoom', {
				id : '-1'
			});
		}
		else if  (chatExist == ChatType.Private) {
			sock.emit('onJoinChatRoom', {
				id : '-3'
			});
		}
		else if  (chatExist == ChatType.Password) {
			sock.emit('onJoinChatRoom', {
				id : '-2'
			});
		}
		else {
			sock.emit('onJoinChatRoom', {
				id : chat_id
			});
			return (chat_id)
		}
		return (null)
	}

	async addUserToChat(username: string, chat_id:string, user_role:string, passeword:string)
	{
		const userId = await this.prismaService.getIdOfLogin(username);
		//need to check if the user is already in the chat
		//if not then :
		if (userId !== undefined)
		{
			// //console.log("date now : ", new Date(Date.now())));
			//console.log("Chat asked have been found");
			const chatId = await this.prismaService.addChanelUser(parseInt(chat_id),userId, user_role, getDate(), null);
			//console.log("chat id upper : ", chatId);
			if (chatId !== undefined)
				return (chatId.toString());
		}
		return ("-1")
	}
}
