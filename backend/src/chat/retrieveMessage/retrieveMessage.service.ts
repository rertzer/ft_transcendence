import { Injectable } from "@nestjs/common";
import {MyGateway } from "../gateway/gateway.service";
import { PrismaChatService } from "../../prisma/chat/prisma.chat.service";
import { parse } from "path";
import { Socket } from "socket.io";


@Injectable()
export class RetrieveMessageService {
	constructor(private prismaService:PrismaChatService){
	}

	async retrieveMessage(chat_id: number, NumToDisplay: number, sock : Socket)
	{


		const messageHistory = [];

		if (chat_id !== undefined)
		{
			const messageReceived = await this.prismaService.RetrieveChatMessage(chat_id);

			if (messageReceived !== undefined)
			{
				for (const element of messageReceived) {
					const username = await this.prismaService.findUser(element.chat_channels_user_id);

					const msg = {
						msg: element.message,
						username: username,
						date: element.date_sent,
						id: element.id,
						chatId: element.chat_channels_id,
					}
					messageHistory.push(msg);
				};

				sock.emit('chatMsgHistory', messageHistory);
			}
		}
	}
}
