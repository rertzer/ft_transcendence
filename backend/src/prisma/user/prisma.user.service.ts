import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import * as argon from 'argon2';
import { EditDto, LoginDto } from 'src/auth/dto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaClient } from '@prisma/client';


@Injectable()
export class PrismaUserService extends PrismaClient
{
  constructor(private config: ConfigService) {
    super()
  }

  
   async getUserByLogin(login: string) {
    let user = await this.user.findUnique({
      where: {
        login: login,
      },
    });
    if (user) {
      return user;
    } else {
      return null;
    }
  }
  
  async getIdByLogin(login: string) {
    const data = await this.user.findFirst({
      select: { id: true },
      where: {
        login,
      },
    });
    if (data) return data.id;
  }
  
  async getAvatarByLogin(login: string) {
    const data = await this.user.findFirst({
      select: { avatar: true },
      where: {
        login,
      },
    });
    if (data) return data.avatar;
  }
  
  async updateUser(dto: EditDto) {
    try {
      const user = await this.user.update({
        where: {
          login: dto.login,
        },
        data: dto,
      });
      return user;
    } catch (error) {
      throw new BadRequestException('Bad request');
    }
  }
  
  async createUser(dto: LoginDto) {
    try {
      const user = await this.user.create({
        data: {
          login: dto.login,
          username: dto.login,
          email: dto.login + '@student.42.fr',
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
}
