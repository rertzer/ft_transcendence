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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
