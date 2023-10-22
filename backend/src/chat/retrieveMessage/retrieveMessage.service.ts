import { Injectable } from "@nestjs/common";
import {MyGateway } from "../gateway/gateway.service";



@Injectable()
export class retrieveMessageService{
	constructor(private gatewayModule: MyGateway){
	}

	async retrievePrivateMessage()
	{
		// const messageReceived = await RetrieveChatMessage(parseInt(messageData.chat_id))
		// if (messageReceived !== undefined)
		// {
		// 	for (const element of messageReceived) {
		// 		const username = await findUser(element.chat_channels_user_id);
		// 		this.server.emit('retrieveMessage', {
		// 			msg: element.message,
		// 			username: username,
		// 			date: element.date_sent,
		// 			id: element.id
		// 		})
		// 	};
	}
}
