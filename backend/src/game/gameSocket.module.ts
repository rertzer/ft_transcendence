import { Module } from "@nestjs/common";
import { GameSocketEvents } from "./gameSocketEvent.gateway";
import { GameService } from "./services/game.service";
import { PlayersService } from "./players/players.service";
import { RoomsService } from "./rooms/rooms.service";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
	imports:[ ScheduleModule.forRoot()],
	providers:[GameSocketEvents, GameService, PlayersService, RoomsService]
})

export class GameSocketModule {}