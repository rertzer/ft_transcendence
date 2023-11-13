import { Injectable } from "@nestjs/common";
import { PrismaChatService } from "../../prisma/chat/prisma.chat.service";
import { parse } from "path";
import { Socket } from "socket.io";
import { getDate } from "../utils/utils.service";

@Injectable()
export class PrivateConvService {
	constructor(private prismaService:PrismaChatService){
	}

	async setDirectConv(creator:string, creatorId:number, receiver: string, sockSender:Socket, sockReceiver: Socket)
	{
			const ChatCreated = await this.createDirectConv(creator, creatorId, receiver);
			console.log("c")

			if (ChatCreated)
			{
				const added = await this.prismaService.addChanelUser(ChatCreated, creatorId, "user", getDate(), null)
				console.log("c")

				if (added)
				{
					console.log("c")
					const IdReceiver = await this.prismaService.getIdOfLogin(receiver);
					if (IdReceiver)
					{
					console.log("c")

						const added2 = await this.prismaService.addChanelUser(ChatCreated, IdReceiver, "user", getDate(), null)
						if (added2)
						{
					console.log("done")

							this.addSocketToRoom(ChatCreated, sockSender, sockReceiver)
							return (true);
						}
					}
				}
			}
		return false;
	}

	async addSocketToRoom(chat_id: number, senderSock: Socket, receiverSock: Socket) {
		senderSock.join(chat_id.toString());
		receiverSock.join(chat_id.toString());
	}

	async createDirectConv(creator:string,creatorId:number, receiver: string)
	{
			const idOfChat = await this.prismaService.addDmChat(creator + " " + receiver, "DM", creatorId);
			return idOfChat;
	}

}
