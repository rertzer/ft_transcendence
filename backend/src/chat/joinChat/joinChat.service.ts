import { Injectable } from "@nestjs/common";
import { PrismaChatService } from "src/prisma/chat/prisma.chat.service";
import { getDate } from "../utils/utils.service";
import { Socket } from "socket.io";
import { ChatType } from "src/prisma/chat/prisma.chat.service";



@Injectable()
export class JoinChatService{
	constructor(private prismaService:PrismaChatService ){
	}

	async joinChat(username: string, chat_id:string, user_role:string, passeword:string, sock : Socket)
	{

		if (this.checkNumber(chat_id) === -1)
			return "-1";
		const value = await this.checkChatExist(chat_id);
		if (parseInt(value) < 0)
		{
			// here if return value = -2 need to check password
			return (value);

		}
		if (!await this.prismaService.checkIfUserIsBanned(parseInt(chat_id), username))
			await this.addUserToChat(username, chat_id, user_role, passeword)
		sock.join(chat_id)
		return value;
	}
	//async addUserToChat(username: string, chat_id:string, user_role:string, passeword:string)

	checkNumber(chat_id: string) : Number
	{
		console.log(chat_id);
		if (Number.isNaN(parseInt(chat_id)))
		{
			return (-1)
		}
		return (0);
	}

	async checkChatExist(chat_id: string) {
		const chatExist = await this.prismaService.checkChatId(parseInt(chat_id));
		if (chatExist == ChatType.NotExisting) {
		  console.log("here 1");
			return "-1";
		} else if (chatExist == ChatType.Private) {
			console.log("here 2");
		  return '-3';
		} else if (chatExist == ChatType.Password) {
			console.log("here 3");
			return '-2';
		} else {
			console.log("here 4");
		  return chat_id; // Convert chat_id to a string
		}
	  }



	async addUserToChat(login: string, chat_id:string, user_role:string, passeword:string)
	{
		const userId = await this.prismaService.getIdOfLogin(login);
		//need to check if the user is already in the chat
		//if not then :
		if (userId !== undefined)
		{
			if (await this.prismaService.userHasbeenKickedInChat(userId, parseInt(chat_id)) == true) //user updated to removed kicked value
				return (0)

			const chatId = await this.prismaService.addChanelUser(parseInt(chat_id),userId, user_role, getDate(), null);
			if (chatId !== undefined)
				return (chatId.toString());
		}
		return ("-1")
	}
}
