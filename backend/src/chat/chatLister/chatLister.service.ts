import { Injectable } from "@nestjs/common";
import {MyGateway } from "../gateway/gateway.service";
import { PrismaChatService} from "../../prisma/chat/prisma.chat.service";
import { Socket } from "socket.io";
@Injectable()
export class ChatLister{
	constructor(private prismaService:PrismaChatService){
	}

	async listChatOfUser(username: string, sock: Socket)
	{
		const chatList = [];
		const retrieveChat = await this.prismaService.getListOfChatByUsername(username);
		sock.emit('ListerUsername', username);
		if (retrieveChat !== undefined)
		{
			for (const chat of retrieveChat)
			{

				const lastMessagesOfChat = await this.prismaService.getLastMessages(chat.id);
				let lastMessageUsername = null;
				let date = null;
				let lastMessage = null;
				let message = null;
				if (lastMessagesOfChat !== undefined && lastMessagesOfChat && lastMessagesOfChat.length > 0)
				{
					lastMessage = lastMessagesOfChat[0];

					date = lastMessage.date_sent;
					message = lastMessage.message;
					lastMessageUsername =  await this.prismaService.getLastMessagesUsername(chat.id);
				}

				const avatarOfOwner = await this.prismaService.getOwnerOfChatAvatar(chat.id);
				const chatType = {
					id: chat.channel.id,
					channelName: chat.channel.name,
					chatPicture: avatarOfOwner,// need to be change
					username: lastMessageUsername,
					msg: message,
					dateSend: date,
				}
				chatList.push(chatType);
			}

			sock.emit('ListOfChatOfUser', chatList);
		}
	}

	async listAllPublicChat(sock: Socket)
	{
		const chats = await this.prismaService.getListOfChat();

		sock.emit('chatList', chats);
	}
}

