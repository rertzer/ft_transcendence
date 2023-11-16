import { Module } from "@nestjs/common";
import { GameSocketEvents } from "./gameSocketEvent.gateway";
import { PlayersService } from "./players/players.service";
import { RoomsService } from "./rooms/rooms.service";
import { ScheduleModule } from "@nestjs/schedule";
import { PrismaGameService } from "src/prisma/game/prisma.game.service";
import { GameLogicService } from "./gameLogic/gameLogic.service";

@Module({
	imports:[ ScheduleModule.forRoot()],
	providers:[GameSocketEvents, PlayersService, RoomsService, PrismaGameService, GameLogicService]
})

export class GameSocketModule {}