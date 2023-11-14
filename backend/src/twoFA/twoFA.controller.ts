import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TwoFAService } from './twoFA.service';
import { GetUser } from 'src/auth/decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('twofa')
export class TwoFAController {
  constructor(private twofaService: TwoFAService) {}

  @Get('setup')
  setup(@GetUser('login') login: string) {
    const qr_url = this.twofaService.setup(login);
    console.log('Controller received url is:', qr_url);
    return qr_url;
  }

  @Get('authenticate')
  authenticate(@Req() req: any) {}
}
