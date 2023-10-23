import { Module } from "@nestjs/common";
import { GameSocketEvents } from "./event/gameSocketEvent";
import { GameService } from "./services/game.service";
import { PlayersService } from "./players/players.service";
import { RoomsService } from "./rooms/rooms.service";

@Module({
  providers:[GameSocketEvents, GameService, PlayersService, RoomsService]
})
export class GameSocketModule {}