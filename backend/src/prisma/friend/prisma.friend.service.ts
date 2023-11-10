import { Injectable } from "@nestjs/common";
import { PrismaClient } from '@prisma/client'
import { OnModuleInit } from "@nestjs/common";
import { PrismaChatService } from "../chat/prisma.chat.service";
@Injectable()
export class PrismaFriendService extends PrismaClient{
	prismaChatService: PrismaChatService

	async addFriend(login: string, newFriend: string)
	{
		const idLogin = await this.prismaChatService.getIdOfLogin(login);
		if (idLogin)
		{
			const idFriend = await this.prismaChatService.getIdOfLogin(newFriend);
			if (idFriend && await this.alreadyFriend(idLogin, idFriend))
			{
				await this.friend.create ({
					data : {
						user_id: idLogin,
						friend_id: idFriend,
					}
				})
			}
		}
	}

	async alreadyFriend(idLogin: number, idFriend:number)
	{
		const friend = await this.friend.findFirst({
			where :{
				user_id: idLogin,
				friend_id: idFriend,
			}
		})
		return friend
	}

	// async removeFriend(login: string, friendToRemove: string)
	// {
	// 	const idLogin
	// }
}
