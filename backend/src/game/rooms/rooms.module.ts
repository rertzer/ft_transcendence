import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { PrismaGameService } from 'src/prisma/game/prisma.game.service';
import { GameService } from './game.service';

@Module({
	providers: [RoomsService, PrismaGameService, GameService],
	exports: [RoomsService, GameService]
})
export class RoomsModule {
	constructor(private roomsService:RoomsService) {}
}
