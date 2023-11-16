import { Injectable } from "@nestjs/common";
import { PrismaChatService } from "src/prisma/chat/prisma.chat.service";
import { getDate } from "../utils/utils.service";
import { Socket } from "socket.io";
import { ChatType } from "src/prisma/chat/prisma.chat.service";



@Injectable()
export class JoinChatService{
	constructor(private prismaService:PrismaChatService ){
	}

	async joinChat(loginId:number, chat_id:number, user_role:string, password:string, sock : Socket)
	{
		const value = await this.checkChatExist(chat_id);
		if (value < 0)
		{
			// here if return value = -2 need to check password
			return (value);

		}
		if (!await this.prismaService.checkIfUserIsBanned(chat_id, loginId))
		{
			const added = await this.addUserToChat(loginId, chat_id, user_role, password);
			if (!added)
			{
				return(-1)
			}
			sock.join(chat_id.toString())
			return value;
		}
		else
			return(-2) //pour indiquer au front que le user est ban du chat qu'il essaie de rejoindre
	}
	//async addUserToChat(username: string, chat_id:string, user_role:string, passeword:string)

	checkNumber(chat_id: string) : Number
	{
		if (Number.isNaN(parseInt(chat_id)))
		{
			return (-1)
		}
		return (0);
	}

	async checkChatExist(chat_id: number) {
		const chatExist = await this.prismaService.checkChatId(chat_id);
		if (chatExist == ChatType.NotExisting) {
			return -1;
		} else {
		  return chat_id; // Convert chat_id to a string
		}
	  }



	async addUserToChat(loginId: number, chat_id:number, user_role:string, password:string)
	{
			const getPasswordOfChat = await this.prismaService.getPasswordOfChat(chat_id)
			if (password == "" ||  getPasswordOfChat === password)
			{
				await this.prismaService.userHasbeenKickedInChat(loginId, chat_id) == true //user updated to removed kicked value
				const chatId = await this.prismaService.addChanelUser(chat_id, loginId, user_role, getDate(), null);
				if (chatId !== undefined)
					return (chatId.toString());
			}
			return (undefined)
		}
	}
