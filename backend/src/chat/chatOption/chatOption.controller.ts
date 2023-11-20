import { Body, Controller, Post, Get, Param } from "@nestjs/common";
import { PrismaChatService } from "src/prisma/chat/prisma.chat.service";
import { MutedUserService } from "../mutedUser/mutedUser.service";
import { getDate } from "../utils/utils.service";
import { MyGateway } from "../gateway/gateway.service";
import { JoinChatService } from "../joinChat/joinChat.service";
import { JwtGuard } from "src/auth/guard";
import { UseGuards } from "@nestjs/common";
import { ChatLister } from "../chatLister/chatLister.service";

// @UseGuards(JwtGuard)
@Controller('chatOption')
export class ChatOptController {
	constructor(private prismaChatService:PrismaChatService, private gateway: MyGateway, private joinChatservice : JoinChatService) {}

	@Post('setAdmin')
	async setUserAsAdmin(@Body() user:{login:string, chatId: number}){
		const id = await this.prismaChatService.getIdOfLogin(user.login);
		console.log("hey owner, id = ", id);
		if (id && (await this.prismaChatService.isAdmin(id, user.chatId)) == false)
		{
			console.log("passed this step")
			await this.prismaChatService.changeChatUserRole(user.chatId, id, "admin");
			return true;
		}
		else
		{
			return false;
		}

	}

	@Post('banUser')
	async banUser(@Body() user:{login:string, chatId: number}){
		console.log("in ban user");
		const idLogin = await this.prismaChatService.getIdOfLogin(user.login);
		if (idLogin)
		{
			const isOwner = await this.prismaChatService.isOwner(user.login, user.chatId);
			if (!isOwner)
			{
				console.log("passed this step");
				const banWorks = await this.prismaChatService.banUserPrism(idLogin, user.chatId);
				if (banWorks)
				{
					const SockArray = this.gateway.getSocketsArray()
					const targetSocket = SockArray.find((socket) => socket.login === user.login);
					if (targetSocket)
					{
						console.log("removed the socket of :",user.login, "from the sock room number:", user.chatId)
						await this.gateway.onChatListOfUser(targetSocket.login, targetSocket.sock);
						targetSocket.sock.leave(user.chatId.toString())
						return true
					}
				}
				return false;
			}
			else
				return {isOwner};
		}
		return (false);
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
		else
		{
			const idLogin = await this.prismaChatService.getIdOfLogin(user.login);
			if (idLogin)
			{
				if (! await this.prismaChatService.isAdmin(idLogin, user.chatId) && ! await this.prismaChatService.isOwner(user.login, user.chatId))
				{
					console.log("passed this step");
						const kicked = await this.prismaChatService.kickUserFromChat(idLogin, user.chatId);
						if (kicked)
						{
							console.log("kickedd :", user.login);
							return true
						}
						return false;
				}
				else
					return false
			}
			return false
		}
	}

	@Post('joinChat')
	async joinChat(@Body() user: {login:string, chat_id: number, password:string})
	{
		const SockArray = this.gateway.getSocketsArray();
		const targetSocket = SockArray.find((socket) => socket.login === user.login);
		if (targetSocket !== undefined)
		{
			const value =  await this.joinChatservice.joinChat(targetSocket.idOfLogin, user.chat_id, "user", user.password, targetSocket.sock);
			const chatlister = new ChatLister(this.prismaChatService);
			chatlister.listChatOfUser(targetSocket.idOfLogin, targetSocket.sock);
			return value;
		}
		return false;
	}
}
