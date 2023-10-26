import {
  ForbiddenException,
  ImATeapotException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, LoginDto, EditDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

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
      console.log('Creating User');
      const password = await argon.hash(dto.password);
      try {
        user = await this.prisma.user.create({
          data: {
            login: dto.login,
            email: dto.login + '@student.42.fr', //dto.email,
            password,
            role: 'player',
          },
        });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException('user already exist');
          }
          throw error;
        }
      }
    } // end of !user
    // password comparison

    if (user) {
      const pwMatches = await argon.verify(
        user.password,
        dto.password,
      );
      if (!pwMatches) {
        console.log('Bad password');
        throw new ForbiddenException('Bad password');
      } else console.log('password ok');
    } else throw new ImATeapotException("For real: I'm a Teapot");
    user.password = 'nop!';
    return user;
  } // end of login

  async edit(dto: EditDto) {
    console.log('edit received dto: ', dto.login);

    if (dto.password) {
      dto.password = await argon.hash(dto.password);
    }

    const user = await this.prisma.user.update({
      where: {
        login: dto.login,
      },
      data: dto,
    });
    if (!user) throw new ForbiddenException('Bad login');
    return user;
  } // end of edit
}
