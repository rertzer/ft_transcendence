import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { PrismaService } from '../prisma/prisma.service';
import { EditDto } from 'src/auth/dto';
import {PrismaUserService} from 'src/prisma/user/prisma.user.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaUserService) {}

  returnIfExist(data: User|null) {
    if (data) {
      data.tfa_secret = 'nope';
      data.tfa_activated = false;
      return data;
    } else {
      throw new BadRequestException('Bad request');
    }
  }

  async fetchByLogin(login: string) {
    const user = await this.prisma.getUserByLogin(login);
    return this.returnIfExist(user);
  }

  async fetchAvatar(avatar: string) {
    return fs.createReadStream('/var/avatar/' + avatar);
  }

  async edit(dto: EditDto) {
    const user = await  this.prisma.updateUser(dto);
    return this.returnIfExist(user);
  }

  async editAvatar(
    file: Express.Multer.File,
    user_login: string,
  ) {
    const old_avatar = await this.prisma.getAvatarByLogin(user_login);
    if (old_avatar) {
      fs.unlink('/var/avatar/' + old_avatar, (error) => {
        if (error) throw error;
      });
    }
    const user = await  this.prisma.updateUser({
      login: user_login,
      avatar: file.filename,
    });
    if (!user) throw new BadRequestException('Bad request');
    return { file };
  }
}
