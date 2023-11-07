import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { MutedUserModule } from './chat/mutedUser/mutedUser.module';
import { GameSocketModule } from './game/gameSocket.module';
import { PlayersModule } from './game/players/players.module';
import { RoomsModule } from './game/rooms/rooms.module';

import { PlayersService } from './game/players/players.service';
import { RoomsService } from './game/rooms/rooms.service';

@Module({
  imports: [/*AuthModule,*/ UserModule, PrismaModule, ChatModule, MutedUserModule, GameSocketModule, PlayersModule, RoomsModule],
  controllers: [],
  providers: [PlayersService, RoomsService],
})
export class AppModule {}
