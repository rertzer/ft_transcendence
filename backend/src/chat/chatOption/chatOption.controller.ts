import { Body, Controller, Post, Get, Param } from "@nestjs/common";
import { PrismaChatService } from "src/prisma/chat/prisma.chat.service";
import { MutedUserService } from "../mutedUser/mutedUser.service";
import { getDate } from "../utils/utils.service";
import { MyGateway } from "../gateway/gateway.service";
import { JoinChatService } from "../joinChat/joinChat.service";


@Controller('chatOption')
export class ChatOptController {
	constructor(private prismaChatService:PrismaChatService, private gateway: MyGateway, private joinChatservice : JoinChatService) {}

	@Post('setAdmin')
	async setUserAsAdmin(@Body() user:{login:string, chatId: number}){
		//check if owner here
		const SockArray = this.gateway.getSocketsArray()
		const targetSocket = SockArray.find((socket) => socket.login === user.login);
		if (targetSocket)
		{
			await this.prismaChatService.changeChatUserRole(user.chatId, targetSocket.idOfLogin, "admin");
		}
	}

	@Post('banUser')
	async banUser(@Body() user:{login:string, chatId: number}){
		console.log("in ban user");
		const SockArray = this.gateway.getSocketsArray()
		const targetSocket = SockArray.find((socket) => socket.login === user.login);
		if (targetSocket)
		{
			if (! await this.prismaChatService.isAdmin(targetSocket.idOfLogin, user.chatId) && ! await this.prismaChatService.isOwner(user.login, user.chatId))
			{
				console.log("passed this step");
				const banWorks = await this.prismaChatService.banUserPrism(targetSocket.idOfLogin, user.chatId);
				if (banWorks)
				{
						console.log("removed the socket of :",user.login, "from the sock room number:", user.chatId)
						this.gateway.onChatListOfUser(user.login, targetSocket.sock);
						targetSocket.sock.leave(user.chatId.toString())
						return true
					}
					return false;
				}
				else
					return false
		}
		else
			return false;
	}

	@Get(':login/banned/:chatId')
	async isUserBanned(
		@Param('login') login: string,
		@Param('chatId') chatId: string,
	) {
		console.log("username receive : ", login, "chat id :", chatId);
		const SockArray = this.gateway.getSocketsArray()
		const targetSocket = SockArray.find((socket) => socket.login === login);
		if (targetSocket)
		{
			const isBanned = await this.prismaChatService.checkIfUserIsBanned(parseInt(chatId), targetSocket.idOfLogin);
			console.log("is banned or not ?", isBanned);
			return { isBanned };
		}
	}

	@Post('kickUser')
	async kickUser(@Body() user:{login:string, chatId: number}) {
		console.log("in kick user ", user.login);
		const SockArray = this.gateway.getSocketsArray()
		const targetSocket = SockArray.find((socket) => socket.login === user.login);
		if (targetSocket)
		{
			if (! await this.prismaChatService.isAdmin(targetSocket.idOfLogin, user.chatId) && ! await this.prismaChatService.isOwner(user.login, user.chatId))
			{
				console.log("passed this step");
					const kicked = await this.prismaChatService.kickUserFromChat(targetSocket.idOfLogin, user.chatId);
					if (kicked)
					{
						console.log("removed the socket of :",user.login, "from the sock room number:", user.chatId)
						await this.gateway.onChatListOfUser(user.login, targetSocket.sock);
						targetSocket.sock.leave(user.chatId.toString())
						return true
					}
					return false;
			}
			else
				return false
		}
	}

	@Post('joinChat')
	async joinChat(@Body() user: {login:string, chat_id: number, password:string})
	{
		console.log("join chat object receive ", user);
		const SockArray = this.gateway.getSocketsArray()
		const targetSocket = SockArray.find((socket) => socket.login === user.login);
		if (targetSocket !== undefined)
		{
			const value = this.joinChatservice.joinChat(targetSocket.idOfLogin, user.chat_id, "user", user.password, targetSocket.sock);
			return value;
		}
	}
}
