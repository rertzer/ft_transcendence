import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { GatewayModule } from './chat/gateway/gateway.module';
import { PrismaClient } from '@prisma/client';
//import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ GatewayModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
