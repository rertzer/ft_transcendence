import { Injectable } from "@nestjs/common";
import * as speakeasy from "speakeasy";
import * as qrcode from "qrcode";
import { PrismaUserService } from "src/prisma/user/prisma.user.service";

@Injectable()
export class TwoFAService {
  constructor(private prisma: PrismaUserService) {}

  async setup(login: string) {
    console.log("TFA setup, login is", login);
    const secret = speakeasy.generateSecret();
  

    const user = await this.prisma.setTfaSecret({
      login,
      secret: secret.ascii,
    });
    if (secret.otpauth_url) {
      const qrcode_url = await qrcode.toDataURL(secret.otpauth_url);
      console.log("In service qrcode_url:", qrcode_url);

      return { qrcode_url };
    }
  }
  async validate(login: string, token: string) {
    let verified = false;
    console.log("Validation", login, token);
    let user = await this.prisma.getUserByLogin(login);
    if (user && user.tfa_secret) {
      console.log("verif in progress...");
      verified = speakeasy.totp.verify({
        secret: user.tfa_secret,
        encoding: "ascii",
        token,
      });
      console.log("verification is", verified);
    }
      user = await this.prisma.setTfaActivated({login, verified});

    return user;
  }

  async authenticate(login: string, token: string) {
    let verified = false;
    console.log("Validation", login, token);
    let user = await this.prisma.getUserByLogin(login);
    if (user && user.tfa_secret) {
      verified = speakeasy.totp.verify({
        secret: user.tfa_secret,
        encoding: "ascii",
        token,
      });
      console.log("verification is", verified);
    }
     
    return verified;
  }
}
