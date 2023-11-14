import { PrismaClient } from '@prisma/client'
import { Injectable } from "@nestjs/common";
import { Room } from 'src/game/Interface/room.interface';

export type GameStatus = 'ONGOING' | 'FORFAIT' | 'FINISHED' ;

@Injectable()
export class PrismaGameService {
	private prismaService: PrismaClient;

	constructor() {
		this.prismaService = new PrismaClient();
	}

	async addNewGame(room:Room) {
		if (!room.playerLeft || !room.playerRight) return 0;
		const idUser1 = await this.getIdOfUsername(room.playerLeft.name);
		const idUser2 = await this.getIdOfUsername(room.playerRight.name);
		if (idUser1 && idUser2)
		{
			const added = await this.prismaService.game.create({
				data: {
					player_one_id:idUser1,
					player_two_id:idUser2,
					game_status: 'ONGOING'
				}
			})
			if (added)
				return added.id;
		}
		return 0 ;
	}

	async getIdOfUsername(login: string){

		const user = await this.prismaService.user.findFirst({
			where: {
				username: login,
			}
		})
		if (user)
			return user.id;
	}
}
