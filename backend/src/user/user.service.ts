import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { PrismaService } from '../prisma/prisma.service';
import { EditDto } from 'src/auth/dto';
import {
  getAvatarByLogin,
  getUserByLogin,
  updateUser,
} from 'src/prisma/user/prisma.user.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  returnIfExist(data: any) {
    if (data) {
      return data;
    } else {
      throw new BadRequestException('Bad request');
    }
  }

  async fetchByLogin(login: string) {
    const user = await getUserByLogin(login);
    return this.returnIfExist(user);
  }

  async fetchAvatar(avatar: string) {
    return fs.createReadStream('/var/avatar/' + avatar);
  }

  async edit(dto: EditDto) {
    const user = await updateUser(dto);
    return this.returnIfExist(user);
  }

  async editAvatar(
    file: Express.Multer.File,
    user_login: string,
  ) {
    const old_avatar = await getAvatarByLogin(user_login);
    if (old_avatar) {
      fs.unlink('/var/avatar/' + old_avatar, (error) => {
        if (error) throw error;
      });
    }
    const user = await updateUser({
      login: user_login,
      avatar: file.filename,
    });
    if (!user) throw new BadRequestException('Bad request');
    return { file };
  }
}
