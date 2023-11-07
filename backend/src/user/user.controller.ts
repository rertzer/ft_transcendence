import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';


import { UserService } from './user.service';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { Response, response } from 'express';


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
    throw new ForbiddenException ('Who are you?');
    ;
  }
  @Get('avatar/:avatar')
  fetchAvatar(
    @Param('avatar') avatar:string,
    @Res() response: Response
  ){
    console.log('getting file', avatar);
    if (avatar != null)
    {
      
      let fileExtension = 'jpg';
      const lastDotIndex = avatar.lastIndexOf('.');
      if (lastDotIndex !== -1){
        fileExtension = avatar.substring(lastDotIndex + 1);
      }
      
      const fileStream = this.userService.fetchAvatar(avatar);
      response.setHeader(
        'Content-Type', `image/${fileExtension}`);
      response.setHeader('Content-Disposition', `attachment; filename=${avatar}`);
        
      fileStream.then((fs)=> fs.pipe(response));
      //response.send(file);
    }
  }
}
