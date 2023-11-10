import { Injectable } from "@nestjs/common";
import {MyGateway } from "../gateway/gateway.service";
import { PrismaChatService} from "../../prisma/chat/prisma.chat.service";
import { Socket } from "socket.io";
@Injectable()
export class ChatLister{
	constructor(private prismaService:PrismaChatService){
	}

	async listChatOfUser(idLogin: number, sock: Socket)
	{
		const chatList = [];
		const retrieveChat = await this.prismaService.getListOfChatByUsername(idLogin);
		if (retrieveChat !== undefined)
		{
			for (const chatUser of retrieveChat)
			{
				const lastMessagesOfChat = await this.prismaService.getLastMessages(chatUser.channel_id);
				let lastMessageUsername = null;
				let date = null;
				let lastMessage = null;
				let message = null;

				if (lastMessagesOfChat !== undefined && lastMessagesOfChat && lastMessagesOfChat.length > 0)
				{
					lastMessage = lastMessagesOfChat[0];

					date = lastMessage.date_sent;
					message = lastMessage.message;
					lastMessageUsername =  await this.prismaService.getLastMessagesUsername(chatUser.channel_id);
				}
				const avatarOfOwner = await this.prismaService.getOwnerOfChatAvatar(chatUser.channel_id);
				console.log("avatar the joined : ", avatarOfOwner);
				const chatType = {
					id: chatUser.channel.id,
					channelName: chatUser.channel.name,
					chatPicture: avatarOfOwner,// need to be change
					username: lastMessageUsername,
					status: chatUser.user_role,
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

