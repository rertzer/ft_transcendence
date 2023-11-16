import { Game, PrismaClient } from '@prisma/client'
import { Injectable, OnModuleInit } from "@nestjs/common";
import { Room, TypeGame } from 'src/game/Interface/room.interface';
import { IPlayer } from 'src/game/Interface/player.interface';

export type GameStatus = 'ONGOING' | 'FORFAIT' | 'FINISHED' ;

@Injectable()
export class PrismaGameService extends PrismaClient implements OnModuleInit {
	
	async onModuleInit() {
		await this.$connect();
	}

	async addNewGame(room:Room) : Promise<Game | null> {
		if (!room.playerLeft || !room.playerRight) return null;
		const idUser1 = await this.getIdOfLogin(room.playerLeft.name);
		const idUser2 = await this.getIdOfLogin(room.playerRight.name);
		if (idUser1 && idUser2)
		{
			const added = await this.game.create({
				data: {
					player_one_id:idUser1, 
					player_two_id:idUser2, 
					game_status: 'ONGOING', 
					type:room.typeGame
				}
			})
			if (added)
				return added;
		}
		return null ;
	}

	async finishGame(room:Room, forfaitPlayer:IPlayer | null): Promise<Game | null> {
		if (!room.playerLeft || !room.playerRight ) return (null) ;
		if (room.bddGameId > 0) {
			let userNameWinner:string;
			if (forfaitPlayer === null) {
				userNameWinner = (room.scoreLeft > room.scoreRight ? room.playerLeft.name : room.playerRight.name);
			}
			else {
				userNameWinner = (room.playerLeft === forfaitPlayer ? room.playerRight.name : room.playerLeft.name)
			}
			const winnerId = await this.getIdOfLogin((userNameWinner));
			
			return (await this.game.update({
				where: {
					id: room.bddGameId
				},
				data: {
					winner_id: winnerId,
					game_status:room.gameStatus, 
					player_one_score:room.scoreLeft,
					player_two_score:room.scoreRight, 
					date_end: new Date()
				}
			}));
		}
		return (null) ;
	}
	
	async getIdOfLogin(login: string) : Promise<number>{

		const user = await this.user.findFirst({
			where: {
				username: login,
			}
		})
		if (user) return user.id;
		else return (-1);
	}
}
