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
		const gameLostByUser = await this.prismaService.game.findMany({
			where: {
				OR: [
					{
						player_one_id: id
					},
					{
						player_two_id: id
					},
			  	],
				NOT: {
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

		const dataToReturn = {
			userLogin:login, 
			userId:id,
			numberGames: (gameWonByUser.length + gameLostByUser.length),
			numberGamesBasic: (gameWonByUser.filter((game)=>{return (game.type === 'BASIC')}).length + gameLostByUser.filter((game)=>{return (game.type === 'BASIC')}).length),
			numberGamesAdvanced: (gameWonByUser.filter((game)=>{return (game.type === 'ADVANCED')}).length + gameLostByUser.filter((game)=>{return (game.type === 'ADVANCED')}).length),
			numberWon: gameWonByUser.length, 
			numberLost: gameLostByUser.length, 
			numberWonBasic: gameWonByUser.filter((game)=>{return (game.type === 'BASIC')}).length, 
			numberLostBasic: gameLostByUser.filter((game)=>{return (game.type === 'BASIC')}).length, 
			numberWonAdvanced: gameWonByUser.filter((game)=>{return (game.type === 'ADVANCED')}).length,
			numberLostAdvanced: gameLostByUser.filter((game)=>{return (game.type === 'ADVANCED')}).length,
			
		};
		return (dataToReturn);		
	}

	async getGameStatsAllUsers() {
		const gameStats = await this.prismaService.game.findMany({
			select: {
				id:true, 
				type:true, 
				game_status:true,
				player_one_id: true, 
				player_two_id: true, 
				winner_id:true,
				player_one_score: true, 
				player_two_score: true, 
				date_begin:true, 
				date_end: true,
			}
		});
		return(gameStats);
	}
}
