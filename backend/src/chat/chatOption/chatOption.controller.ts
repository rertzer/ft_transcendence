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
	async setUserAsAdmin(@Body() user:{username:string, chatId: number}){
		//check if owner here
		await this.prismaChatService.changeChatUserRole(user.chatId, user.username, "admin");
	}

	@Post('banUser')
	async banUser(@Body() user:{username:string, chatId: number}){
		console.log("in ban user");
		if (! await this.prismaChatService.isAdmin(user.username, user.chatId) && ! await this.prismaChatService.isOwner(user.username, user.chatId))
		{
			console.log("passed this step");
			const banWorks = await this.prismaChatService.banUser(user.username, user.chatId);
			if (banWorks)
			{
				const SockArray = this.gateway.getSocketsArray()
				const targetSocket = SockArray.find((socket) => socket.login === user.username);
				if (targetSocket)
				{
					console.log("removed the socket of :",user.username, "from the sock room number:", user.chatId)
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

	@Get(':username/banned/:chatId')
	async isUserBanned(
		@Param('username') username: string,
		@Param('chatId') chatId: string,
	) {
		const isBanned = await this.prismaChatService.checkIfUserIsBanned(parseInt(chatId),username);
	return { isBanned };
	}

	@Post('kickUser')
	async kickUser(@Body() user:{login:string, chatId: number}) {
		console.log("in kick user ");
		if (! await this.prismaChatService.isAdmin(user.login, user.chatId) && ! await this.prismaChatService.isOwner(user.login, user.chatId))
		{
			console.log("passed this step");
			const kicked = await this.prismaChatService.kickUserFromChat(user.login, user.chatId);
			if (kicked)
			{
				const SockArray = this.gateway.getSocketsArray()
				const targetSocket = SockArray.find((socket) => socket.login === user.login);
				if (targetSocket)
				{
					console.log("removed the socket of :",user.login, "from the sock room number:", user.chatId)
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
	async joinChat(@Body() user: {username:string, chat_id: string, user_role:string, passeword:string })
	{
		console.log("join chat object receive ", user);
		const SockArray = this.gateway.getSocketsArray()
		const targetSocket = SockArray.find((socket) => socket.login === user.username);
		if (targetSocket !== undefined)
		{
			const value = this.joinChatservice.joinChat(user.username, user.chat_id, user.user_role, user.passeword, targetSocket.sock);
			return value;
		}
	}
}
