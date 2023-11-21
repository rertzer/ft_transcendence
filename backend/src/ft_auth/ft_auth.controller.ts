import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  Body,
  Post,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FtAuthService } from './ft_auth.service';
import { Request, Response } from 'express';

@Controller('ft_auth')
export class FtAuthController {
  constructor(private ftAuthService: FtAuthService) {}
  
  @UseGuards(AuthGuard('oauth2'))
  @Get('login')
  login(@Req() req: Request) {console.log("inside login", req)}
  
  @UseGuards(AuthGuard('oauth2'))
  @Get('callback')
  ftAuthRedirect(@Req() req: Request, @Res() res: Response) {
   return this.ftAuthService.loginCb(req, res);  
  }
  
  @Post('token')
  ftAuthToken(@Body('key') key:string){
    console.log("received key", key);
    return this.ftAuthService.provideTokenByKey(key);
  }
}
