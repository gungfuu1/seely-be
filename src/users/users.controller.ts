import { LoggedInDto } from '@app/auth/dto/logged-in.dto';
import { PasswordRemoverInterceptor } from '@app/interceptors/password-remover.interceptor';
import { Body, Controller, Get, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(PasswordRemoverInterceptor)
  @Get('me')
  async findByUsername(@Req() req: any) {
    console.log('req.user from JwtStrategy:', req.user);
    return this.usersService.findByUsername(req.user.username);
  }
}
