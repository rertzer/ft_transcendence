import { Injectable } from '@nestjs/common';
import { PrismaGameService } from 'src/prisma/game/prisma.game.service';

@Injectable()
export class GameStatsService {
	constructor(private prismaService: PrismaGameService){}

	async getGameStatsUser(login:string) {
		const id = await this.prismaService.getIdOfLogin(login);
		const gameWonByUser = await this.prismaService.game.findMany({
			where: {
				OR: [
					{
						player_one_id: id
					},
					{
						player_two_id: id
					},
			  	],
				AND: {
					winner_id:id
				},
			},
			select: {
				id:true, 
				type:true, 
				game_status:true,
				player_one_id: true, 
				player_two_id: true, 
				player_one_score: true, 
				player_two_score: true, 
				date_begin:true, 
				date_end: true,
			}
		});
		return(gameWonByUser);
	}

	async getGameStatsAllUsers() {
		const gameStats = await this.prismaService.game.findMany({
			select: {
				id:true, 
				type:true, 
				game_status:true,
				player_one_id: true, 
				player_two_id: true, 
				player_one_score: true, 
				player_two_score: true, 
				date_begin:true, 
				date_end: true,
			}
		});
		return(gameStats);
	}
}
