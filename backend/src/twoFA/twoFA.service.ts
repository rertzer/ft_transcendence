import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';

@Injectable()
export class TwoFAService {
  constructor() {}

  async setup(login: string) {
    console.log('TFA setup, login is', login);
    const secret = speakeasy.generateSecret();

    if (secret.otpauth_url) {
      const qrcode_url = await qrcode.toDataURL(
        secret.otpauth_url,
      );
      console.log('In service qrcode_url:', qrcode_url);
      return {qrcode_url};
    }
  }

  async authenticate(req: any) {}
}
