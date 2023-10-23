import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { GatewayModule } from './chat/gateway/gateway.module';
import { PrismaClient } from '@prisma/client';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
//import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, UserModule, PrismaModule,  ChatModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
