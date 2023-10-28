import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, EditDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

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

  @Post('editAvatar')
  @UseInterceptors(FileInterceptor('file'))
  editAvatar(@UploadedFile() file : Express.Multer.File){
    return this.authService.editAvatar(file);
  }

}
