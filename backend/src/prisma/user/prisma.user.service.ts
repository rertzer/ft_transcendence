import { ConfigService } from "@nestjs/config";
import { EditDto } from "src/auth/dto";
import {
  BadRequestException,
  Injectable,
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { twoFASecretDto } from "src/twoFA/dto/twoFASecret.dto";
import { twoFAActivatedDto } from "src/twoFA/dto/twoFAActivated.dto";
import { FtUser } from "src/ft_auth/dto/FtUser.dto";

@Injectable()
export class PrismaUserService extends PrismaClient {
  constructor(private config: ConfigService) {
    super();
  }

  async getUserByLogin(login: string) {
    try {
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
    } catch (error) {
      throw new BadRequestException("Bad request");
    }
  }

  async getIdByLogin(login: string) {
    try {
      const data = await this.user.findFirst({
        select: { id: true },
        where: {
          login,
        },
      });
      if (data) return data.id;
    } catch (error) {
      throw new BadRequestException("Bad request");
    }
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
      throw new BadRequestException("Bad request");
    }
  }

  async setTfaSecret(dto: twoFASecretDto) {
    try {
      const user = await this.user.update({
        where: {
          login: dto.login,
        },
        data: { tfa_secret: dto.secret },
      });
      return user;
    } catch (error) {
      throw new BadRequestException("Bad request");
    }
  }
  async setTfaActivated(dto: twoFAActivatedDto) {
    try {
      const user = await this.user.update({
        where: {
          login: dto.login,
        },
        data: { tfa_activated: dto.verified },
      });
      return user;
    } catch (error) {
      throw new BadRequestException("Bad request");
    }
  }

  async createUser(dto: FtUser) {
    try {
      const user = await this.user.create({
        data: {
          login: dto.login,
          username: dto.username,
          first_name: dto.first_name,
          last_name: dto.last_name,
          email: dto.email,
          role: "player",
        },
      });
      return user;
    } catch (error) {
      throw new BadRequestException("Bad request");
    }
  }
}
