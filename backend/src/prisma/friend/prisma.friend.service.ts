import { Injectable } from "@nestjs/common";
import { PrismaClient } from '@prisma/client'
import { OnModuleInit } from "@nestjs/common";
import { PrismaChatService } from "../chat/prisma.chat.service";
@Injectable()
export class PrismaFriendService extends PrismaClient{

	async getIdOfLogin(login: string){ // this need to be removed

		const user = await this.user.findFirst({
			where: {
				login: login,
			}
		})
		if (user)
			return user.id;
	}

	async addFriend(idLogin: number, newFriend: string)
	{
		console.log("idlogin -= ",idLogin, "new friend  =", newFriend);
			const idFriend = await this.getIdOfLogin(newFriend);
			console.log("id friend = ",idFriend)
			if (idFriend && await this.alreadyFriend(idLogin, idFriend) == false)
			{
				console.log("passsed this")
				const created = await this.friend.create ({
					data : {
						user_id: idLogin,
						friend_id: idFriend,
					}
				})
				console.log("created or nah : ", created);
				return created;
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
		if (friend)
			return true
		return false
	}

	async idFriendToDelete(idLogin: number, idFriend:number)
	{
		const friend = await this.friend.findFirst({
			where :{
				user_id: idLogin,
				friend_id: idFriend,
			}
		})
		if (friend)
			return friend.id
		return false
	}

	async deleteFriend(idLogin:number, friend:string)
	{
		const idFriend = await this.getIdOfLogin(friend);
		if (idFriend)
		{
			const friendToDelete = await this.idFriendToDelete(idLogin, idFriend);
			if (friendToDelete)
			{
				const deleted = this.friend.delete({
				where :{
					id: friendToDelete
				}
				})
			}
		}
	}
}
