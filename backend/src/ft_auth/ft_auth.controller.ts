import {
  Controller,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FtAuthService } from './ft_auth.service';

@UseGuards(AuthGuard('oauth2'))
@Controller('ft_auth')
export class FtAuthController {
  constructor(private ftAuthService: FtAuthService) {}
  
  @Get('login')
  login(@Req() req: any) {}

  @Get('callback')
  ftAuthRedirect(@Req() req: any) {
    return this.ftAuthService.loginCb(req);
  }
}
