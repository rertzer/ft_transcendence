import { Injectable } from "@nestjs/common";
import {MyGateway } from "../gateway/gateway.service";
import {checkChatId, checkLogin} from "../prisma/prisma.check";
import { ChatType } from "../prisma/prisma.check";
import {addChat, RetrievePrivateMessage, addPrivateMessage,getIdOfLogin, addChatMessage, addChanelUser, RetrieveChatMessage, findUser } from "../prisma/prisma.service";
import { getDate } from "../utils/utils.service";


@Injectable()
export class JoinChatService{
	constructor(private gatewayModule: MyGateway){
	}

	async joinChat(username: string, chat_id:string, user_role:string, passeword:string)
	{
		if (this.checkNumber(chat_id) === -1)
			return;
		if (this.checkChatExist(chat_id) === null)
			return;
	}

	checkNumber(chat_id: string) : Number
	{
		if (Number.isNaN(parseInt(chat_id)))
		{
			console.log("Chat asked is not a number")
			this.gatewayModule.getWebsocketServer().emit('onJoinChatRoom', {
				id : '-1'
			});
			return (-1)
		}
		return (0);
	}

	async checkChatExist(chat_id: string) {
		const chatExist = await checkChatId(parseInt(chat_id));
		if (chatExist == ChatType.NotExisting) {
			this.gatewayModule.getWebsocketServer().emit('onJoinChatRoom', {
				id : '-1'
			});
		}
		else if  (chatExist == ChatType.Private) {
			this.gatewayModule.getWebsocketServer().emit('onJoinChatRoom', {
				id : '-3'
			});
		}
		else if  (chatExist == ChatType.Password) {
			this.gatewayModule.getWebsocketServer().emit('onJoinChatRoom', {
				id : '-2'
			});
		}
		else {
			this.gatewayModule.getWebsocketServer().emit('onJoinChatRoom', {
				id : chat_id
			});
			return (chat_id)
		}
		return (null)
	}

	async addUserToChat(username: string, chat_id:string, user_role:string, passeword:string)
	{
		const userId = await getIdOfLogin(username);
		//need to check if the user is already in the chat
		//if not then :
		if (userId !== undefined)
		{
			// console.log("date now : ", new Date(Date.now())));
			addChanelUser(parseInt(chat_id),userId, user_role, getDate(), null);
			console.log("Chat asked have been found");
		}
	}
}


// 		const messageReceived = await RetrieveChatMessage(parseInt(chat_id))
// 		if (messageReceived !== undefined)
// 		{
// 			for (const element of messageReceived) {
// 				const username = await findUser(element.chat_channels_user_id);
// 				this.gatewayModule.getWebsocketServer().emit('retrieveMessage', {
// 					msg: element.message,
// 					username: username,
// 					date: element.date_sent,
// 					id: element.id
// 				})
// 			};
// 		}
