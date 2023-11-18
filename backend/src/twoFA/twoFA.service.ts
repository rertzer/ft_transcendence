import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { PrismaUserService } from 'src/prisma/user/prisma.user.service';

@Injectable()
export class TwoFAService {
  constructor(private prisma: PrismaUserService) {}
  

  async setup(login: string) {
    console.log('TFA setup, login is', login);
    const secret = speakeasy.generateSecret();


    const user = await  this.prisma.setTfaHashedSecret({login,hashedSecret: secret.ascii});
    if (secret.otpauth_url) {
      const qrcode_url = await qrcode.toDataURL(
        secret.otpauth_url,
      );
      console.log('In service qrcode_url:', qrcode_url);

      return {qrcode_url};
    }
  }
  async validate(login:string, token:string){
    return 'true';
  }

  async authenticate(req: any) {}
}
