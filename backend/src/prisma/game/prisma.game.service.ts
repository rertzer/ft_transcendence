import { Game, GameMaps, GameObstacles, GameParams, PrismaClient } from '@prisma/client'
import { Injectable, OnModuleInit } from "@nestjs/common";
import { Room, TypeGame } from 'src/game/Interface/room.interface';
import { Player } from 'src/game/Interface/player.interface';

export type GameStatus = 'ONGOING' | 'FORFAIT' | 'FINISHED' ;

@Injectable()
export class PrismaGameService extends PrismaClient implements OnModuleInit {
	
	async onModuleInit() {
		await this.$connect();
	}

	async initDB(){ 
		this.initGameParams()
		.then(()=> {this.initMaps().then((maps) => {this.initObstacles(maps)})})
	}

	async initGameParams() { 
		const gameParam = await this.gameParams.findMany();
		if (gameParam.length === 0) {
			await this.gameParams.create({
				data:{}
			});
			await this.gameParams.create({
				data:{
					type:"ADVANCED",
					goal:10
				}
			});
		}
	}
 
	async initMaps() : Promise<GameMaps[]>{
		const maps = await this.gameMaps.findMany();
		if (maps.length === 0) {
			for (let i = 0; i < 4; i++) {
				maps.push(await this.gameMaps.create({
					data:{
						nbBalls:3,
					}
				}));
			}
		}		
		return(maps);
	} 

	async initObstacles(maps: GameMaps[]) : Promise<GameObstacles[]> {
		const bdd_obstacles = await this.gameObstacles.findMany();
		if (bdd_obstacles.length === 0) {
			if (maps.length < 4) return [];
			const obstacles = [
				{posx: 0.15, posy:0.10, width: 0.20, height: 0.20, img:'img0.png', lives:5, gameMapsId:maps[0].id},
				{posx: 0.70, posy:0.10, width: 0.10, height: 0.20, img:'img1.png', lives:5, gameMapsId:maps[0].id},
				{posx: 0.20, posy:0.70, width: 0.10, height: 0.20, img:'img2.png', lives:5, gameMapsId:maps[0].id},
				{posx: 0.65, posy:0.70, width: 0.20, height: 0.20, img:'img3.png', lives:5, gameMapsId:maps[0].id},
				{posx: 0.35, posy:0.10, width: 0.30, height: 0.20, img:'img4.png', lives:5, gameMapsId:maps[1].id},
				{posx: 0.35, posy:0.70, width: 0.30, height: 0.20, img:'img5.png', lives:5, gameMapsId:maps[1].id},
				{posx: 0.20, posy:0.10, width: 0.10, height: 0.20, img:'img6.png', lives:5, gameMapsId:maps[2].id},
				{posx: 0.65, posy:0.10, width: 0.20, height: 0.20, img:'img7.png', lives:5, gameMapsId:maps[2].id},
				{posx: 0.15, posy:0.70, width: 0.20, height: 0.20, img:'img8.png', lives:5, gameMapsId:maps[2].id},
				{posx: 0.70, posy:0.70, width: 0.10, height: 0.20, img:'img9.png', lives:5, gameMapsId:maps[2].id},
				{posx: 0.15, posy:0.20, width: 0.20, height: 0.60, img:'img10.png', lives:5, gameMapsId:maps[3].id},
				{posx: 0.65, posy:0.20, width: 0.20, height: 0.60, img:'img11.png', lives:5, gameMapsId:maps[3].id}
			];
			const createdObstacles = await Promise.all(
				obstacles.map(async (ob) => {
					return await this.gameObstacles.create({ data: ob });
				})
			);
			return createdObstacles;
		}
		return [];
	}

	async getRandomGameMaps() : Promise<GameMaps> {
		const gameMaps = await this.gameMaps.findMany({});
		const i = Math.floor(Math.random() * gameMaps.length)
		return (gameMaps[i]);
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
					game_status: 'ONGOING'
				}
			})
			if (added)
				return added;
		}
		return null ;
	}

	async finishGame(room:Room, forfaitPlayer:Player | null): Promise<Game | null> {
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
