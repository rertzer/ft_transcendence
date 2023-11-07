import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { PrismaGameService } from 'src/prisma/game/prisma.game.service';

@Module({
	providers: [RoomsService, PrismaGameService],
	exports: [RoomsService]
})
export class RoomsModule {
	constructor(private roomsService:RoomsService) {}
}
