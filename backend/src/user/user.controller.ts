import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';

//import { UserDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':login')
  fetchByLogin(@Param('login') login: string) {
    return this.userService.login(login);
  }
}