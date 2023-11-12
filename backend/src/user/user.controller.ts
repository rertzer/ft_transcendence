import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { UserService } from './user.service';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { Response, response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { EditDto } from 'src/auth/dto';

//import { UserDto } from './dto';
@UseGuards(JwtGuard)
@Controller('user')
//@ApiTags('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':login')
  fetchByLogin(
    //@GetUser() user: User,
    @GetUser('login') user_login: string,
    @Param('login') login: string,
  ) {
    if (user_login === login)
      return this.userService.fetchByLogin(login);
    throw new ForbiddenException('Who are you?');
  }
  @Get('avatar/:avatar')
  fetchAvatar(
    @Param('avatar') avatar: string,
    @Res() response: Response,
  ) {
    console.log('getting file', avatar);
    if (avatar != null) {
      let fileExtension = 'jpg';
      const lastDotIndex = avatar.lastIndexOf('.');
      if (lastDotIndex !== -1) {
        fileExtension = avatar.substring(lastDotIndex + 1);
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
      //response.send(file);
    }
  }

  @UseGuards(JwtGuard)
  @Post('editAvatar')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 2 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowedFileExtensions = [
          '.jpg',
          '.png',
          '.jpeg',
          'xcf',
          '.pdf',
        ];
        enum FileValidationErrors {
          UNSUPPORTED_FILE_TYPE,
        }
        const extension = extname(file.originalname);
        if (allowedFileExtensions.includes(extension)) {
          cb(null, true);
        } else {
          // provide the validation error in the request
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

  @UseGuards(JwtGuard)
  @Post('edit')
  edit(@Body() dto: EditDto) {
    return this.userService.edit(dto);
  }
}
