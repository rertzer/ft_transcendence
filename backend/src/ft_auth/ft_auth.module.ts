import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { FtAuthController } from './ft_auth.controller';
import { FtAuthService } from './ft_auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FortytwoStrategy } from './ft_auth.strategy';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [JwtModule.register({}), PrismaModule, HttpModule],
  controllers: [FtAuthController],
  providers: [FtAuthService, FortytwoStrategy]
})
export class FtAuthModule {}