import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { EditDto } from 'src/auth/dto';
import { UserService } from './user.service';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':login')
  fetchByLogin(
    @Param('login') login: string,
  ) {
      return this.userService.fetchByLogin(login);
  }

  @Get('username/:username')
  fetchByUsername(
    @Param('username') username: string,
  ) {
    console.log("eekkkkkkkkkkkk");
    return this.userService.fetchByUsername(username);
  }

  @Get('avatar/:avatar')
  fetchAvatar(
    @Param('avatar') avatar: string,
    @Res() response: Response,
  ) {
    console.log('getting file', avatar);
    if (avatar != null) {
      let fileExtension = '';
      const lastDotIndex = avatar.lastIndexOf('.');
      if (lastDotIndex !== -1) {
        fileExtension = avatar.substring(lastDotIndex + 1);
      } else {
        throw new BadRequestException('No valid file');
      }
      const fileStream = this.userService.fetchAvatar(avatar);
      response.setHeader(
        'Content-Type',
        `image/${fileExtension}`,
      );
      response.setHeader(
        'Content-Disposition',
        `attachment; filename=${avatar}`,
      );
      fileStream.then((fs) => fs.pipe(response));
    }
  }

  @Post('editAvatar')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 2 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowedFileExtensions = [
          '.jpg',
          '.png',
          '.jpeg',
          '.xcf',
        ];
        enum FileValidationErrors {
          UNSUPPORTED_FILE_TYPE,
        }
        const extension = extname(file.originalname);
        if (allowedFileExtensions.includes(extension)) {
          cb(null, true);
        } else {
          req.fileValidationError =
            FileValidationErrors.UNSUPPORTED_FILE_TYPE;
          cb(null, false);
        }
      },
      storage: diskStorage({
        destination: '/var/avatar',

        filename: (req, file, cb) => {
          cb(null, `${Date.now()}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  editAvatar(
    @GetUser('login') user_login: string,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.userService.editAvatar(file, user_login);
  }

  @Post('edit')
  edit(@Body() dto: EditDto) {
    return this.userService.edit(dto);
  }
}
