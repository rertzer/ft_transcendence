import {
  ForbiddenException,
  ImATeapotException,
  Injectable,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as argon from "argon2";
import { LoginDto } from "../auth/dto";
import { PrismaUserService } from "src/prisma/user/prisma.user.service";
import { Request, Response } from "express";
import { FtUser } from "./dto/FtUser.dto";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { log } from "console";

@Injectable()
export class FtAuthService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private prismaUser: PrismaUserService
  ) {}
  private randKeys: { login: string; key: string }[] = [];

  async loginCb(req: Request, res: Response) {
    if (!req.user) {
      return { success: "false" };
    }
    const user: any = req.user;
    const randKey = this.setTemporaryKey(user.login);
    res.redirect(`http://localhost:3000/redirect?key=${randKey}`);
    return {
      success: "true",
      user: req.user,
    };
  }
  async validateUser(dto: FtUser) {
    let user = await this.prismaUser.getUserByLogin(dto.login);
    if (!user) {
      user = await this.prismaUser.createUser(dto);
    }
    if (!user) {
      throw new ImATeapotException("For real: I'm a Teapot");
    }
    return user;
  }

  getLoginByKey(key: string) {
    console.log("tableau GLBK", this.randKeys, "cle", key);
    function isKey(k: { login: string; key: string }) {
      return k.key === key;
    }
    const storedKey = this.randKeys.find(isKey);
    if (storedKey) {
      const index = this.randKeys.indexOf(storedKey);
      const login = storedKey.login;
      this.randKeys.splice(index, 1);
      console.log("login found is", login);
      return login;
    }
  }

  setTemporaryKey(login: string): string {
    const randomDigits = Array.from({ length: 30 }, () =>
      Math.floor(Math.random() * 10)
    ).join("");
    const key = randomDigits.toString();
    this.randKeys.push({ login, key });
    console.log("tableau STK", this.randKeys);
    return key;
  }

  async signToken(
    login: string
  ): Promise<{ login: string; access_token: string }> {
    const payload = {
      sub: login,
    };
    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: "59m",
      secret: this.config.get("JWT_SECRET"),
    });
    return { login, access_token };
  }

  async provideTokenByKey(key: string) {
    console.log("provided key", key);
    const login = this.getLoginByKey(key);
    console.log("login is", login);
    if (login) {
      return this.signToken(login);
    }
  }

  async fetchUser(accessToken: string, cb: any) {
    const headersRequest = {
      Authorization: `Bearer ${accessToken}`,
    };
    const httpService = new HttpService();
    try {
      const { data } = await firstValueFrom(
        httpService.get("https://api.intra.42.fr/v2/me", {
          headers: headersRequest,
        })
      );
      const user: FtUser = {
        login: data.login,
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.usual_full_name,
        email: data.email,
      };
      const pong_user = await this.validateUser(user);
      console.log("pong user is ", pong_user);
      return cb(null, pong_user);
    } catch (error) {
      throw new ForbiddenException("42, we have a problem");
    }
  }
}
