import { Module } from "@nestjs/common";
import { GameSocketEvents } from "./gameSocketEvent.gateway";
import { PlayersService } from "./players/players.service";
import { RoomsService } from "./rooms/rooms.service";
import { ScheduleModule } from "@nestjs/schedule";
import { PrismaGameService } from "src/prisma/game/prisma.game.service";
import { GameService } from "./gameLogic/game.service";

@Module({
	imports:[ ScheduleModule.forRoot()],
	providers:[GameSocketEvents, PlayersService, RoomsService, PrismaGameService, GameService]
})

export class GameSocketModule {}