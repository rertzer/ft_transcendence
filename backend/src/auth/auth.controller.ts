import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, EditDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }
  @Post('edit')
  edit(@Body() dto: EditDto) {
    return this.authService.edit(dto);
  }

}
