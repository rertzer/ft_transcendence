import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameSocketModule } from './game/gameSocket.module';
import { GameService } from './game/services/game.service';

@Module({
  imports: [GameSocketModule],
  controllers: [AppController],
  providers: [AppService, GameService],
})
export class AppModule {}
