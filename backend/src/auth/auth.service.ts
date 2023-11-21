import {
  ForbiddenException,
  ImATeapotException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { LoginDto } from './dto';
import { PrismaUserService } from 'src/prisma/user/prisma.user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private prismaUser: PrismaUserService,
  ) {}

  async login(dto: LoginDto) {
    let user = await this.prismaUser.getUserByLogin(dto.login);
    if (!user) {
     // user = await this.prismaUser.createUser(dto);
    }
    if (!user) {
      throw new ImATeapotException("For real: I'm a Teapot");
    }
    return this.signToken(user.login);
  }

  async signToken(
    login: string,
  ): Promise<{ login: string; access_token: string }> {
    const payload = {
      sub: login,
    };
    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: '59m',
      secret: this.config.get('JWT_SECRET'),
    });
    return { login, access_token };
  }
}
