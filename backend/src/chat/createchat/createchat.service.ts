import { Injectable } from "@nestjs/common";
import {MyGateway } from "../gateway/gateway.service";
import {checkChatId, checkLogin} from "../../prisma/chat/prisma.chat.check";
import { ChatType } from "../../prisma/chat/prisma.chat.check";
import {addChat, RetrievePrivateMessage, addPrivateMessage,getIdOfLogin, addChatMessage, addChanelUser, RetrieveChatMessage, findUser } from "../../prisma/chat/prisma.chat.service";
import { getDate } from "../utils/utils.service";
import { Socket } from "socket.io";
import {encodePassword} from '../password/password.service';


@Injectable()
export class CreateChatService {
	constructor(private gatewayModule: MyGateway){
	}

	async createChat(username:string, chatPassword: string, chatName: string, chatType: string, targetSocket: Socket)
	{
		const idOfUser = await getIdOfLogin(username);
			console.log("id of user : ", idOfUser);
			let encodedPassword : string | null = null;
			if (chatPassword)
				encodedPassword = await encodePassword(chatPassword);
			console.log("encoded password : ", encodedPassword);
			console.log("id of user : ", idOfUser);
			if (idOfUser !== undefined)
			{
				const chatId = (await this.emitAndCreateRoom(username, encodedPassword, chatName, chatType, targetSocket, idOfUser)).toString();
				targetSocket.join(chatId.toString());
				console.log("someone trying to join chat id : ", chatId.toString());
			}
	}

	async emitAndCreateRoom(username:string, encodedPassword: string  | null, chatName: string, typeOfChat: string, targetSocket: Socket, idOfUser: number)
	{
		const newChatId = await addChat(chatName, typeOfChat, idOfUser, encodedPassword );
		const chatType = {
			id: newChatId,
			channelName: chatName,
			chatPicture: 'avatarOfOwner',// need to be change
			username: null,
			msg: null,
			dateSend: null,
		}
		targetSocket.emit('newChat', chatType)
		await addChanelUser(newChatId, idOfUser, 'admin', getDate(), null).then(()=> targetSocket.emit('chatList', username));
		return (newChatId);
	}
}