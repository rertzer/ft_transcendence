import { Injectable } from "@nestjs/common";
import {MyGateway } from "../gateway/gateway.service";
import { PrismaChatService} from "src/prisma/chat/prisma.chat.service";
import { getDate } from "../utils/utils.service";
import { Socket } from "socket.io";
import { ChatLister } from "../chatLister/chatLister.service";


@Injectable()
export class CreateChatService {
	constructor(private prismaService: PrismaChatService){
	}

	async createChat(login: string, idLogin:number, chatPassword: string, chatName: string, chatType: string, targetSocket: Socket)
	{
		const idOfUser = await this.prismaService.getIdOfLogin(login);

			if (idOfUser !== undefined)
			{
				const chatId = (await this.emitAndCreateRoom(login, chatPassword, chatName, chatType, targetSocket, idOfUser)).toString();
				targetSocket.join(chatId.toString());
				const chatlister = new ChatLister(this.prismaService);
				chatlister.listChatOfUser(idLogin, targetSocket);
			}
	}

	async emitAndCreateRoom(username:string, encodedPassword: string  | null, chatName: string, typeOfChat: string, targetSocket: Socket, idOfUser: number)
	{
		const newChatId = await this.prismaService.addChat(chatName, typeOfChat, idOfUser, encodedPassword );
		const chatType = {
			id: newChatId,
			channelName: chatName,
			chatPicture: 'avatarOfOwner',// need to be change
			status: "owner",
			username: null,
			msg: null,
			dateSend: null,
		}
		targetSocket.emit('newChat', chatType)
		await this.prismaService.addChanelUser(newChatId, idOfUser, 'owner', getDate(), null).then(()=> targetSocket.emit('chatList', username));
		return (newChatId);
	}
}
