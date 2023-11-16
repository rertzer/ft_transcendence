import {
  Injectable,
} from '@nestjs/common';

@Injectable()
export class FtAuthService {
  constructor() {}

  async loginCb(req: any) {
    console.log('ftauth login');
    if (!req.user) {
      return { message: '42 Panic' };
    }
    return {
      message: "Don't Panic",
      user: req.user,
    };
  }
}
