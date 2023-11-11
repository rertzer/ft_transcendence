import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { FtAuthService } from './ft_auth.service';
import { AuthGuard } from '@nestjs/passport';

import { Express } from 'express';

@Controller('ft_auth')
export class FtAuthController {
  constructor(private ftAuthService: FtAuthService) {}

  @Get('test')
  test(){return "test";}
  
  @Get('login')
  @UseGuards(AuthGuard('oauth2'))
  login(@Req() req:any) {
  }

  @Get('callback')
  @UseGuards(AuthGuard('oauth2'))
  ftAuthRedirect(@Req()req:any){
    return this.ftAuthService.loginCb(req);
  }
}
