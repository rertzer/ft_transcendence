import { Module } from '@nestjs/common';
import { PrismaGameService } from 'src/prisma/game/prisma.game.service';
import { GameService } from './game.service';

@Module({
	providers: [PrismaGameService, GameService],
	exports: [GameService]
})
export class GameLogicModule {
	constructor(private roomsService:GameService) {}
}
