import { Injectable } from "@nestjs/common";
import {MyGateway } from "../gateway/gateway.service";
import { RetrieveChatMessage, findUser } from "../../prisma/chat/prisma.chat.service";
import { parse } from "path";



@Injectable()
export class RetrieveMessageService {
	constructor(private gatewayModule: MyGateway){
	}

	async retrievePrivateMessage(chat_id: string, NumToDisplay: number)
	{
		console.log(chat_id)
		console.log(parseInt(chat_id))
		if (!Number.isNaN(parseInt(chat_id)))
		{
			console.log("in retrieve private message class");
			const messageReceived = await RetrieveChatMessage(parseInt(chat_id));
			if (messageReceived !== undefined)
			{
				for (const element of messageReceived) {
					const username = await findUser(element.chat_channels_user_id);
					console.log("in send ")
					this.gatewayModule.getWebsocketServer().emit('retrieveMessage', {
						msg: element.message,
						username: username,
						date: element.date_sent,
						id: element.id
					})
				};
			}
		}
	}
}
