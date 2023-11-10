import { Injectable } from "@nestjs/common";
import { PrismaChatService } from "src/prisma/chat/prisma.chat.service";
import { getDate } from "../utils/utils.service";
import { Socket } from "socket.io";
import { ChatType } from "src/prisma/chat/prisma.chat.service";



@Injectable()
export class JoinChatService{
	constructor(private prismaService:PrismaChatService ){
	}

	async joinChat(username: string, chat_id:number, user_role:string, password:string, sock : Socket)
	{

		// if (this.checkNumber(chat_id) === -1)
		// 	return "-1";

		const value = await this.checkChatExist(chat_id);
		if (value < 0)
		{
			// here if return value = -2 need to check password
			return (value);

		}
		console.log("lol");
		if (!await this.prismaService.checkIfUserIsBanned(chat_id, username))
		{
			console.log("lol 2")
			const added = await this.addUserToChat(username, chat_id, user_role, password);
			if (!added)
			{
				console.log("added failed")
				return(-1)
			}
			console.log("chat_id to string = ", chat_id.toString());
			sock.join(chat_id.toString())
			return value;
		}
		else
			return(-2) //pour indiquer au front que le user est ban du chat qu'il essaie de rejoindre
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

	async checkChatExist(chat_id: number) {
		const chatExist = await this.prismaService.checkChatId(chat_id);
		if (chatExist == ChatType.NotExisting) {
		  console.log("here 1");
			return -1;
		} else {
			console.log("here 4");
		  return chat_id; // Convert chat_id to a string
		}
	  }



	async addUserToChat(login: string, chat_id:number, user_role:string, password:string)
	{
		const userId = await this.prismaService.getIdOfLogin(login);
		//need to check if the user is already in the chat
		//if not then :
		if (userId !== undefined)
		{
			const getPasswordOfChat = await this.prismaService.getPasswordOfChat(chat_id)
			console.log("password retrieve : ", getPasswordOfChat, "password receive = ", password);
			if (getPasswordOfChat === password)
			{
				console.log("hey");
				await this.prismaService.userHasbeenKickedInChat(userId, chat_id) == true //user updated to removed kicked value
				const chatId = await this.prismaService.addChanelUser(chat_id,userId, user_role, getDate(), null);
				if (chatId !== undefined)
					return (chatId.toString());
			}
		}
		return (undefined)
	}
}
