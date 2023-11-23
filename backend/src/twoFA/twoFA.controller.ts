import { Controller, Get, UseGuards, Req, Body, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TwoFAService } from './twoFA.service';
import { GetUser } from 'src/auth/decorator';
import { twoFADto } from './dto/twoFA.dto';

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

  @Post('validate')
  validate(@GetUser('login') login: string,
  @Body() dto: twoFADto) {
    const user = this.twofaService.validate(login, dto.token);
    console.log('Controller received answer:', user);
    return user;
  }

  @Get('authenticate')
  authenticate(@Req() req: any) {}
}
