import {
  ForbiddenException,
  ImATeapotException,
  Injectable,
} from '@nestjs/common';
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
      throw new ForbiddenException("No way");
    }
  }
}
