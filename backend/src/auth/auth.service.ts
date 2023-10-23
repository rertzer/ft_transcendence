import {
  ForbiddenException,
  ImATeapotException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) { }
  async login(dto: AuthDto) {
    // log existing user
    console.log(dto.login);
    let user = await this.prisma.user.findUnique({
      where: {
        login: dto.login,
      },
    });
    if (user)
      console.log("user found");
    if (!user) {
      console.log("Creating User");
      const password = await argon.hash(
        dto.password,
      );
      try {
        user = await this.prisma.user.create({
          data: {
            login: dto.login,
            username: dto.username,
            email: dto.email,
            password,
            role: 'user',
          },
        });
      } catch (error) {
        if (
          error instanceof
          PrismaClientKnownRequestError
        ) {
          if (error.code === 'P2002') {
            throw new ForbiddenException(
              'user already exist',
            );
          }
          throw error;
        }
      }
    } // end of !user
    // password comparison
    if (user) {
      const pwMatches = argon.verify(
        user.password,
        dto.password,
      );
      if (!pwMatches)
        throw new ForbiddenException(
          'Bad password',
        );
    }

    else
      throw new ImATeapotException(
        'For real: I\'m a Teapot'
      )
     user.password = 'nop!';
    return user;
  }
}
