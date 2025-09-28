import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UsernameParamDto } from './dto/username-param.dto';
import { PasswordRemoverInterceptor } from '@app/interceptors/password-remover.interceptor';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseInterceptors(PasswordRemoverInterceptor)
  @Get(':username')
  findByUsername(@Param() param: UsernameParamDto) {
    return this.usersService.findByUsername(param.username);
  }
}
