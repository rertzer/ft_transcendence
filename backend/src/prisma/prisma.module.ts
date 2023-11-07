import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaChatModule } from './chat/prisma.chat.module';
import { PrismaGameModule } from './game/prisma.game.module';

@Global()
@Module({
	imports: [PrismaChatModule, PrismaGameModule]
})
export class PrismaModule {}
