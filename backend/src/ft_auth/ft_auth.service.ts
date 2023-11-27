import {
  ForbiddenException,
  ImATeapotException,
  Injectable,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaUserService } from "src/prisma/user/prisma.user.service";
import { Request, Response } from "express";
import { FtUser } from "./dto/FtUser.dto";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom, throwError } from "rxjs";
import { TwoFAService } from "src/twoFA/twoFA.service";
import { TfaToken } from "./dto/TfaToken.dto";

@Injectable()
export class FtAuthService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private prismaUser: PrismaUserService,
    private twoFAService: TwoFAService,
  ) {}
  private randKeys: { login: string; tfa_activated: boolean; key: string }[] =
    [];

  async loginCb(req: Request, res: Response) {
    if (!req.user) {
      return { success: "false" };
    }
    const user: any = req.user;
    console.log("tfa status", user.tfa_activated);
    const randKey = this.setTemporaryKey(user.login, user.tfa_activated);
    if (user.tfa_activated)
      res.redirect(`http://localhost:3000/redirect/twofa?key=${randKey}`);
    else res.redirect(`http://localhost:3000/redirect?key=${randKey}`);

    return {
      success: "true",
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

  getStoredKeyByKey(key: string) {
    console.log("tableau GLBK", this.randKeys, "cle", key);
    function isKey(k: { login: string; key: string }) {
      return k.key === key;
    }
    const storedKey = this.randKeys.find(isKey);
    if (storedKey) {
      const index = this.randKeys.indexOf(storedKey);
      this.randKeys.splice(index, 1);
      console.log("login found is", storedKey.login);
      return storedKey;
    }
  }

  setTemporaryKey(login: string, tfa_activated: boolean): string {
    const randomDigits = Array.from({ length: 30 }, () =>
      Math.floor(Math.random() * 10)
    ).join("");
    const key = randomDigits.toString();
    this.randKeys.push({ login, tfa_activated, key });
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
    const stored_key = this.getStoredKeyByKey(key);
    if (stored_key){console.log("login is", stored_key.login);
    if (stored_key.login && ! stored_key.tfa_activated) {
      return this.signToken(stored_key.login);
    }}
    throw new ForbiddenException("2fa, we have a problem");
  }

  async provideTokenByKeyAndTfa({ key, tfa_token }: TfaToken) {
    console.log("provideTokenByKeyAndTfa ", key, tfa_token);
    const stored_key = this.getStoredKeyByKey(key);
    let validate = false;
    if (stored_key && stored_key.login) {
    console.log("checking...");
      validate = await this.twoFAService.authenticate(stored_key.login, tfa_token);
      if (validate) return this.signToken(stored_key.login);
    }
    console.log("validation is", validate);
    throw new ForbiddenException("2fa, we have a problem");
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
