import { Body, Controller, Post, Get, Param } from "@nestjs/common";
import { PrismaChatService } from "src/prisma/chat/prisma.chat.service";
import { PrismaFriendService } from "src/prisma/friend/prisma.friend.service";
import { MyGateway } from "src/chat/gateway/gateway.service";
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { UseGuards } from "@nestjs/common";

// @UseGuards(JwtGuard)
@Controller('friend')
export class addFriendController {
	constructor(private prismaFriendService: PrismaFriendService, private gateway: MyGateway)
	{}

	@Post('addFriend')
	async addFriend(@Body() data:{login:string, friendToAdd:string})
	{
		console.log("oin add friend");
		const SockArray = this.gateway.getSocketsArray()
		const targetSocket = SockArray.find((socket) => socket.login === data.login);
		if (targetSocket)
		{
			console.log("in addFriend a pass");
			const done = await this.prismaFriendService.addFriend(targetSocket.idOfLogin, data.friendToAdd)
			console.log("worked = ",done );
		}

	}

	@Post('deleteFriend')
	async deleteFriend(@Body() user:{login: string, friendToDelete:string})
	{
		const SockArray = this.gateway.getSocketsArray()
		const targetSocket = SockArray.find((socket) => socket.login === user.login);
		if (targetSocket)
		{
			this.prismaFriendService.deleteFriend(targetSocket.idOfLogin, user.friendToDelete)
		}
	}

	@Get('listFriends/:login')
	async listFriend (
		@Param('login') login:string
	)
	{
		console.log("in list friends");	
	}

	@Get(':myLogin/:loginFriend/isMyFriend')
	async checkIfFriend (
		@Param('myLogin') myLog:string,
		@Param('loginFriend') friendLog: string,
	)
	{
		const idLog = await this.prismaFriendService.getIdOfLogin(myLog);
		const idFriend = await this.prismaFriendService.getIdOfLogin(friendLog);
		if (idLog && idFriend)
		{
			const friend = await this.prismaFriendService.alreadyFriend(idLog, idFriend);
			console.log("friend or nah = ", friend);
			return friend; 
		}
	}
}
