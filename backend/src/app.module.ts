import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { FtAuthModule } from './ft_auth/ft_auth.module';
import { TwoFAModule } from './twoFA/twoFA.module';
import { MutedUserModule } from './chat/mutedUser/mutedUser.module';
import { GameSocketModule } from './game/gameSocket.module';
import { PlayersModule } from './game/players/players.module';
import { RoomsModule } from './game/rooms/rooms.module';

import { PlayersService } from './game/players/players.service';
import { RoomsService } from './game/rooms/rooms.service';
import { GameLogicModule } from './game/gameLogic/gameLogic.module';
import { FriendModule } from './friend/friend.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    FtAuthModule,
    TwoFAModule,
    UserModule,
    PrismaModule,
    ChatModule,
    MutedUserModule,
    GameSocketModule,
    PlayersModule,
    RoomsModule, GameLogicModule,
    FriendModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
