import { Module } from "@nestjs/common";
import { GameSocketEvents } from "./event/gameSocketEvent";
import { GameService } from "./services/game.service";

@Module({
  providers:[GameSocketEvents, GameService]
})
export class GameSocketModule {}