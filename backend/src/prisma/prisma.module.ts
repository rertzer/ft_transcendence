import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaChatModule } from './chat/prisma.chat.module';
import { PrismaFriendModule } from './friend/prisma.friend.module';

@Global()
@Module({
	imports: [PrismaChatModule, PrismaFriendModule]
})
export class PrismaModule {}
