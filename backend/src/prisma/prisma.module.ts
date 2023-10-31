import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaChatModule } from './chat/prisma.chat.module';

@Global()
@Module({
	imports: [PrismaChatModule]
})
export class PrismaModule {}
