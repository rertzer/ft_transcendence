import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameSocketModule } from './game/gameSocket.module';
import { GameService } from './game/services/game.service';
import { PlayersModule } from './game/players/players.module';
import { PlayersService } from './game/players/players.service';
import { RoomsModule } from './game/rooms/rooms.module';
import { RoomsService } from './game/rooms/rooms.service';

@Module({
  imports: [GameSocketModule, PlayersModule, RoomsModule],
  controllers: [AppController],
  providers: [AppService, GameService, PlayersService, RoomsService],
})
export class AppModule {}
