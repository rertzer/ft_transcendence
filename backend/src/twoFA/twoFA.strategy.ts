import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TwoFAStrategy extends PassportStrategy(
  Strategy,
  'twofa',
) {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({});
  }
  async validate(){}
}
