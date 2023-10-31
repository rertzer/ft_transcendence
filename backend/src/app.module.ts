import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { MutedUserModule } from './chat/mutedUser/mutedUser.module';

@Module({
  imports: [AuthModule, UserModule, PrismaModule, ChatModule, MutedUserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
