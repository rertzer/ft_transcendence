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

	async getFriendRelationId(idLogin: number, idFriend:number)
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

	// async alreadyFriend(idLogin: number, idFriend:number)
	// {
	// 	console.log("whats happening", idLogin, idFriend);
	// 	const friend = await this.friend.findFirst({
	// 		where :{
	// 			user_id: idLogin,
	// 			friend_id: idFriend,
	// 		}
	// 	})
	// 	console.log("friend = ", friend);
	// 	if (friend)
	// 		return friend.id
	// 	 return undefined
	// }

	async deleteFriend(idLogin:number, idFriend:number)
	{
			const friendToDelete = await this.getFriendRelationId(idLogin, idFriend);
			console.log(friendToDelete);
			if (friendToDelete)
			{
				const deleted = await this.friend.delete({
				where :{
					id: friendToDelete
				}
				})
				if (deleted)
					return true
			}
			return false
	}

	async checkInGame(id: number) {
		const inGame = await this.game.findFirst({
			where: {
				game_status:"ONGOING",
				OR: [
					{
						player_one_id: id,
					},
					{
						player_two_id:id,
					}
				]
			}
		})
		if (inGame)
			return true;
		return false;
	}


	async getLoginOfId(id:number)
	{
		const login = this.user.findFirst({
			where: {
				id: id,
			}
		})
		if (login)
			return (login);
	}
	async listAllFriends(login:string)
	{
		const idOfLogin = await this.getIdOfLogin(login);
		if (idOfLogin)
		{
			const listsFriends = await this.friend.findMany({
				where:{
					user_id: idOfLogin
				}
			})
			if (listsFriends)
				return listsFriends;
		}
	}
	// async removeFriend(login: string, friendToRemove: string)
	// {
	// 	const idLogin
	// }
}
