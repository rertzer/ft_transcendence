import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, EditDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: '/var/avatar',
      filename: (req, file, cb)=>{
        cb(null, `${Date.now()}${extname(file.originalname)}`)
      } 
    })
  }))
  editAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|gif)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.authService.editAvatar(file);
  }
}
