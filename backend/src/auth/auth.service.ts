import {
  ForbiddenException,
  ImATeapotException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { LoginDto } from './dto';
import { createUser, getUserByLogin } from 'src/prisma/user/prisma.user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    let user = await getUserByLogin(dto.login);
    if (!user) {
      user = await createUser(dto);
    }
    if (user) {
      let pwMatches = false;
      if (user.password) {
        pwMatches = await argon.verify(
          user.password,
          dto.password,
        );
      }
      if (!pwMatches) {
        throw new ForbiddenException('Bad password');
      }
    } else {
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
