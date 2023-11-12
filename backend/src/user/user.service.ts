import {
  ForbiddenException,
  ImATeapotException,
  Injectable,
} from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { EditDto } from 'src/auth/dto';
import { getUserByLogin } from 'src/prisma/user/prisma.user.service';


@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async fetchByLogin(login: string) {
    // log existing user
    const user = await getUserByLogin(login);
    if (user) {
      return user;
    } else {
      throw new ForbiddenException('Bad login');
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