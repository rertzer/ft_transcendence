import {
  ForbiddenException,
  ImATeapotException,
  Injectable,
} from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async fetchByLogin(login: string) {
    // log existing user
    console.log('UserService received: ', login);
    let user = await this.prisma.user.findUnique({
      where: {
        login: login,
      },
    });
    if (user) {
      console.log('user found');
      user.password = 'nop!';
      return user;
    } else {
      throw new ForbiddenException('No way');
    }
  }

  async fetchAvatar(avatar: string) {
    avatar = join('/var/avatar', avatar);
    fs.stat(avatar, (e, s) => {
      console.log('size', s.size);
    });
    console.log('reading file', avatar);
    return fs.createReadStream(avatar);
  }
}
