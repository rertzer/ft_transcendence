import { Injectable } from '@nestjs/common';
import { PrismaGameService } from 'src/prisma/game/prisma.game.service';

@Injectable()
export class GameStatsService {
	constructor(private prismaService: PrismaGameService){}

	async getGameStatsUser(login:string) {}
}
