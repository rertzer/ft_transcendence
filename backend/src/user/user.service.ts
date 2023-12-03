import {
  BadRequestException,
  Injectable,
} from "@nestjs/common";
import * as fs from "fs";
import { EditDto } from "src/auth/dto";
import { PrismaUserService } from "src/prisma/user/prisma.user.service";
import { User } from "@prisma/client";
import { AvatarDto } from "./avatar.dto";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaUserService) {}
  returnIfExist(data: User | null) {
    if (data) {
      data.tfa_secret = "nope";
      data.tfa_activated = false;
      return data;
    } else {
      throw new BadRequestException("Bad request");
    }
  }

  async fetchByLogin(login: string) {
    const user = await this.prisma.getUserByLogin(login);
    return this.returnIfExist(user);
  }

  async fetchAvatar(avatar: string) {
    if (fs.existsSync("/var/avatar/" + avatar)) {
      return fs.createReadStream("/var/avatar/" + avatar);
    } else {
      throw new BadRequestException("unable to find avatar");
    }
  }

  async edit(dto: EditDto) {
    const user = await this.prisma.updateUser(dto);
    return this.returnIfExist(user);
  }

  async editAvatar(file: Express.Multer.File, user_login: string) {
    const old_avatar = await this.prisma.getAvatarByLogin(user_login);
    console.log("old avatar is", old_avatar);
    console.log("new avatar is", file.filename);
    if (old_avatar) {
      fs.unlink("/var/avatar/" + old_avatar, (error) => {
        if (error) {
          console.log("avatar not found");
          throw new BadRequestException("unable to delete previous avatar");
        }
      });
    }
    console.log("updating avatar");
    const user = await this.prisma.updateUser({
      login: user_login,
      avatar: file.filename,
    });
    console.log("user now", user);
    if (!user) throw new BadRequestException("Bad request");
    return { file };
  }

  async getFileExtension(avatar: AvatarDto)
  {
    let fileExtension :string | null = "";
      const lastDotIndex = avatar.name.lastIndexOf(".");
      if (lastDotIndex !== -1) {
        fileExtension = avatar.name.substring(lastDotIndex + 1);
      } else {
        fileExtension = null;
      }
  }

  async teaPot(){
    console.log('teaPot service');
    return this.prisma.test();
  }
}
