import {
  ForbiddenException,
  ImATeapotException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, LoginDto, EditDto } from './dto';
import * as argon from 'argon2';
import * as fs from 'fs';

import { User } from '@prisma/client';
import { Express } from 'express';
import { ConfigService } from '@nestjs/config';
import { promises } from 'dns';

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
    } else
      throw new ImATeapotException("For real: I'm a Teapot");

    return this.signToken(user.login);
  } // end of login()

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

  async editAvatar(
    file: Express.Multer.File,
    user_login: string,
  ) {
    console.log('Editing avatar login is', user_login);
    const find_data: { avatar: string | null; } | null = await this.prisma.user.findUnique({
      select: {
        avatar: true,
      },
      where: {
        login: user_login,
      },
    });
    if (find_data)
    {
      if (find_data.avatar != null)
      { console.log ('deleting old file', find_data.avatar);
      fs.unlink('/var/avatar/' + find_data.avatar, (err)=>{
        if (err)
        {
          console.log (err);
          throw err;
        }
      });}
     
      

      const user = await this.prisma.user.update({
      where: {
        login: user_login,
      },
      data: {avatar: file.filename},
    });
    if (!user) throw new ForbiddenException('Bad request');
    }
    
    
   
    console.log(file);
    return { file };
  } // end of editAvatar
}
