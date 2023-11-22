import { Body, Controller, Post, Get, Param } from "@nestjs/common";
import { GameStatsService } from "./gameStats.service";

import { JwtGuard } from '../auth/guard';
import { UseGuards } from "@nestjs/common";

@UseGuards(JwtGuard)
@Controller('gameStats')
export class gameStatsControler {
	constructor(private gameStatsService: GameStatsService){}

	@Get(':login')
	async getGameStatsUser(
		@Param('login') login: string,
	){
		return this.gameStatsService.getGameStatsUser(login);
	}
	@Get()
	async getGameStatsAllUsers(){
		return this.gameStatsService.getGameStatsAllUsers();
	}
	
}
