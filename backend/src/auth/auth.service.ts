import {
  ForbiddenException,
  ImATeapotException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, EditDto } from './dto';
import * as argon from 'argon2';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    // log existing user
    console.log('received dto: ', dto.login);
    let user = await this.prisma.user.findUnique({
      where: {
        login: dto.login,
      },
    });
    if (user) console.log('user found');
    if (!user) {
      user = await this.createUser(dto);
    } // end of !user

    if (user && user.password) {
      const pwMatches = await argon.verify(
        user.password,
        dto.password,
      );
      if (!pwMatches) {
        console.log('Bad password');
        throw new ForbiddenException('Bad password');
      } else console.log('password ok');
    } else
      throw new ImATeapotException("For real: I'm a Teapot");

    return this.signToken(user.login);
  } // end of login()

  async createUser(dto: LoginDto): Promise<User| null>{
    console.log('Creating User');
    
      const password = await argon.hash(dto.password);
      try {
        const user = await this.prisma.user.create({
          data: {
            login: dto.login,
            email: dto.login + '@student.42.fr', //dto.email,
            password,
            role: 'player',
          },
        });
        return user;
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException('user already exist');
          }
          throw error;
        }
      }
      return null;
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
  } // end of signToken()

 


}
