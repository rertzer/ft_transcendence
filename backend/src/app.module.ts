import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AdminModule } from './chat/admin/admin.module';

@Module({
  imports: [AuthModule, UserModule, PrismaModule, ChatModule, AdminModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
