import { BadRequestException, Injectable } from "@nestjs/common";
import * as fs from "fs";
import { EditDto } from "src/user/dto";
import { PrismaUserService } from "src/prisma/user/prisma.user.service";
import { User } from "@prisma/client";
import { AvatarDto } from "./dto/avatar.dto";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaUserService) {}
  returnIfExist(data: User | null) {
    console.log("return if exist");
    if (data) {
      data.tfa_secret = "nope";
      data.tfa_activated = false;
      return data;
    } else {
      throw new BadRequestException("Sorry, bad request");
    }
  }

  async fetchByUsername(username: string) {
    console.log("username = ", username);
    const user = await this.prisma.getUserByUsername(username);
    return this.returnIfExist(user);
  }

  async fetchByLogin(login: string) {
    const user = await this.prisma.getUserByLogin(login);
    return this.returnIfExist(user);
  }

  async fetchAvatar(avatar: string) {
    console.log("fetchAvatar");
    if (fs.existsSync("/var/avatar/" + avatar)) {
      return fs.createReadStream("/var/avatar/" + avatar);
    } else {
      console.log("fetchAvatar, bad request");
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
    if (!user) throw new BadRequestException("Bad request, can't do that");
    return { file };
  }

  async getFileExtension(avatar: string) {
    console.log("getFileExtension");
    const pattern = /^\d{13}\.\w{3,4}$/g;
    if (! pattern.exec(avatar))
    {
      console.log("getFileExtension, bad pattern");
      return null;
    }
    console.log("getFileExtension, pattern ok");
    let fileExtension: string | null = "";
    const lastDotIndex = avatar.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      fileExtension = avatar.substring(lastDotIndex + 1);
    } else {
      fileExtension = null;
    }
    return fileExtension;
  }

}
