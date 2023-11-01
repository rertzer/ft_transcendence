import { Injectable } from "@nestjs/common";
import {MyGateway } from "../gateway/gateway.service";
import { PrismaChatService} from "src/prisma/chat/prisma.chat.service";
import { getDate } from "../utils/utils.service";
import { Socket } from "socket.io";
import {encodePassword} from '../password/password.service';


@Injectable()
export class CreateChatService {
	constructor(private prismaService: PrismaChatService){
	}

	async createChat(username:string, chatPassword: string, chatName: string, chatType: string, targetSocket: Socket)
	{
		const idOfUser = await this.prismaService.getIdOfLogin(username);

			let encodedPassword : string | null = null;
			if (chatPassword)
				encodedPassword = await encodePassword(chatPassword);


			if (idOfUser !== undefined)
			{
				const chatId = (await this.emitAndCreateRoom(username, encodedPassword, chatName, chatType, targetSocket, idOfUser)).toString();
				targetSocket.join(chatId.toString());

			}
	}

	async emitAndCreateRoom(username:string, encodedPassword: string  | null, chatName: string, typeOfChat: string, targetSocket: Socket, idOfUser: number)
	{
		const newChatId = await this.prismaService.addChat(chatName, typeOfChat, idOfUser, encodedPassword );
		const chatType = {
			id: newChatId,
			channelName: chatName,
			chatPicture: 'avatarOfOwner',// need to be change
			username: null,
			msg: null,
			dateSend: null,
		}
		targetSocket.emit('newChat', chatType)
		await this.prismaService.addChanelUser(newChatId, idOfUser, 'admin', getDate(), null).then(()=> targetSocket.emit('chatList', username));
		return (newChatId);
	}
}
