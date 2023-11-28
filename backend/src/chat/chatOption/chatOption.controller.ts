import { Body, Controller, Post, Get, Param,Delete } from "@nestjs/common";
import { PrismaChatService } from "src/prisma/chat/prisma.chat.service";
import { MyGateway } from "../gateway/gateway.service";
import { JoinChatService } from "../joinChat/joinChat.service";
import { JwtGuard } from "src/auth/guard";
import { getDate } from "../utils/utils.service";
import { UseGuards, ParseIntPipe } from "@nestjs/common";
import { ChatLister } from "../chatLister/chatLister.service";
import * as argon from 'argon2';

@UseGuards(JwtGuard)
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

	@Post('inviteUser')
	async inviteUser(@Body() data:{ownerLogin:string, username:string, chat_id:number})
	{
		if (await this.prismaChatService.isOwner(data.ownerLogin, data.chat_id))
		{
			const id = await this.prismaChatService.getIdOfUsername(data.username)
			if ( id > 0)
			{
				if (!await this.prismaChatService.userAlreadyInChat(id, data.chat_id))
				{
					if (await this.prismaChatService.addChanelUser(data.chat_id, id, "user", getDate(), null))
					{

						return ({message: "ok"});
					}
					return ({message: "issue while adding new user"})
				}
				return ({message: `User ${data.username} is already in this channel`})
			}
			else
			{
				return ({message: `User ${data.username} doesn't exist`})
			}
		}
		else
		{
			return({message: "You cannot invite anyone if you don't own the channel"})
		}

	}

	@Post('blockUser')
	async blockUser(@Body() data: {blockedLogin:string, login:string})
	{
		return await this.prismaChatService.blockUser(data.login, data.blockedLogin, getDate());
	}

	@Post('unblockUser')
	async unblockUser(@Body() data: {blockedLogin:string, login:string})
	{
		return await this.prismaChatService.unblockUser(data.login, data.blockedLogin);
	}

	@Post('isBlocked')
	async isBlockUser(@Body() data: {blockedLogin:string, login:string})
	{
		return await this.prismaChatService.userIsblocked(data.login, data.blockedLogin);
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
		@Param('chatId', ParseIntPipe) chatId: number,
	) {
		console.log("username receive : ", login, "chat id :", chatId);
		const SockArray = this.gateway.getSocketsArray()
		const targetSocket = SockArray.find((socket) => socket.login === login);
		if (targetSocket)
		{
			const isBanned = await this.prismaChatService.checkIfUserIsBanned(chatId, targetSocket.idOfLogin);
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
			const isOwner = await this.prismaChatService.isOwner(user.login, user.chatId);
			if (!isOwner)
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
				return {isOwner}
		}
		else
		{
			const idLogin = await this.prismaChatService.getIdOfLogin(user.login);
			if (idLogin)
			{
				const isOwner = await this.prismaChatService.isOwner(user.login, user.chatId);
				if (!isOwner)
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
					return {isOwner}
			}
			return false
		}
	}

	@Post('leaveChat')
	async onLeaveChat(@Body() data:{login:string, chatId: number})
	{
		const id = await this.prismaChatService.getIdOfLogin(data.login);
		if (id)
		{
			if (!await this.prismaChatService.isOwner(data.login, data.chatId))
			{
				const succeed = await this.prismaChatService.kickUserFromChat(id, data.chatId);
				if (succeed)
					return (true);
			}
			else
			{
				const succeed = await this.prismaChatService.leaveAsOwner(id,data.chatId);
				if (succeed)
					return (true);
			}
		}
	}

	@Post('changeType')
	async changeChatType(@Body() chatType:{password:string, type: string, chatId: number, login: string})
	{
		let worked;
		const isOwner = await this.prismaChatService.isOwner(chatType.login, chatType.chatId);
		if (isOwner)
		{
			if (chatType.password.length > 0)
			{
				const hashed_password = await argon.hash(chatType.password,);
				worked = await this.prismaChatService.updateChatWithPassword(hashed_password, chatType.type, chatType.chatId);
			}
			else
			{
				worked = await this.prismaChatService.updateChatTypeNoPass(chatType.chatId, chatType.type);
			}
			return( worked);
		}
		else
			return ("Not Owner")
	}

	@Get("listOfBlockedUser/:login")
	async listOfBlockUser(
		@Param('login') login: string,
	) {
		const listBlocked = await this.prismaChatService.getListOfBlocked(login)
		if (listBlocked)
			return listBlocked;
		else
			return false;
	}

	@Post("updateDmName")
	async updateDmName(
		@Body() data: {
			OldUsername:string, newUsername:string}
	)
	{
		console.log("old username and new", data.OldUsername, data.newUsername);
		const arrayOfDm = await this.prismaChatService.getAllDm(data.OldUsername);
		if (arrayOfDm)
		{
			await this.prismaChatService.updateNewUsernameOnDm(arrayOfDm, data.OldUsername, data.newUsername)
		}
	}

	@Get(':login/info/:chatId')
	async userInfo(
		@Param('login') login: string,
		@Param('chatId', ParseIntPipe) chatId: number,
	) {
		console.log("hey succeed");
		const userInfo = this.prismaChatService.getChatChannelsUser(login, chatId);

		if (userInfo)
			return userInfo;
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

	@Delete('deleteMessage/:idMessage')
	async onDeleteMessage (
		@Param('idMessage', ParseIntPipe) idMessage: number,
	)
	{
		return await this.prismaChatService.deleteMessage(idMessage);
	}
}
