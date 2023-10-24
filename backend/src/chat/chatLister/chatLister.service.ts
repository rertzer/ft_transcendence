import { Injectable } from "@nestjs/common";
import {MyGateway } from "../gateway/gateway.service";
import {getListOfChat, getLastMessages,getOwnerOfChatAvatar, getLastMessagesUsername } from "../../prisma/chat/prisma.chat.service";

@Injectable()
export class ChatLister{
	constructor(private gatewayModule: MyGateway){
	}

	async listChatOfUser(username: string)
	{
		const chatList = [];
		const retrieveChat = await getListOfChat(username);
		for (const chat of retrieveChat)
		{
			//console.log("chat : ", chat)
			const lastMessagesOfChat = await getLastMessages(chat.id);
			let lastMessageUsername = null;
			let date = null;
			let lastMessage = null;
			let message = null;
			if (lastMessagesOfChat !== undefined && lastMessagesOfChat && lastMessagesOfChat.length > 0)
			{
				lastMessage = lastMessagesOfChat[0];
				//console.log("lastMessage : ", lastMessage)
				date = lastMessage.date_sent;
				message = lastMessage.message;
				lastMessageUsername =  await getLastMessagesUsername(chat.id);
			}
			//console.log("lastMessages : ", lastMessage);
			const avatarOfOwner = await getOwnerOfChatAvatar(chat.id);
			const chatType = {
				id: chat.id,
				channelName: chat.channel.name,
				chatPicture: avatarOfOwner,
				username: lastMessageUsername,
				msg: message,
				dateSend: date,
			}
			chatList.push(chatType);
		}
		console.log("chatList : ", chatList);
		this.gatewayModule.getWebsocketServer().emit('ListOfChat', chatList);
	}
}
// socket.on('chatList', (channelHistoryReceive :{id: number, channelName: string, chatPicture: string,
// 	username: String, msg: string, dateSend: Date  }) => {
// console.log("trigger chat list, what i receive :", channelHistoryReceive)
// const add : allChatOfUser = {id:channelHistoryReceive.id, channelName: channelHistoryReceive.channelName,
// chatPicture: channelHistoryReceive.chatPicture, username: channelHistoryReceive.username, msg: channelHistoryReceive.msg, dateSend: channelHistoryReceive.dateSend}
// console.log("hey ")
// console.log("Previous channelHistory:", add);
// setChatsOfUser((prevChat) => [...prevChat, add]);
// // Debugging: Check the updated chatHistory
// console.log("Updated channelHistory:", add);
// });
