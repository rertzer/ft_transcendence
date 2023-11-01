import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';


//import { UserDto } from './dto';
@UseGuards(JwtGuard)
@Controller('user')
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
}
