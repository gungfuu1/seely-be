import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@app/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoggedInDto } from './dto/logged-in.dto';
import { TokensDto } from './dto/tokens.dto';
import { Role } from '@app/users/entities/user.entity';

@Injectable()
export class KeycloakService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async handleKeycloakLogin(userInfo: any): Promise<TokensDto> {
    // หา user จาก DB
    let user = await this.usersService.findByUsername(userInfo.preferred_username);

    if (!user) {
      // ถ้าไม่มี  create ใหม่
      user = await this.usersService.create({
        username: userInfo.preferred_username,
        keycloakId: userInfo.sub,
        email: userInfo.email,
        firstName: userInfo.given_name || '',
        lastName: userInfo.family_name || '',
        role: Role.USER,
        password: '',
      } as any);
    } else {
      // ถ้ามีอยู่แล้ว  update
      user = await this.usersService.update(user.id, {
        keycloakId: userInfo.sub,
        email: userInfo.email,
        firstName: userInfo.given_name || '',
        lastName: userInfo.family_name || '',
      });
    }

    if (!user) {
      throw new UnauthorizedException('Failed to create or update user from Keycloak');
    }

    
    const loggedInDto: LoggedInDto = {
      id: user.id,                       
      username: user.username,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    return this.generateTokens(loggedInDto);
  }

  private generateTokens(loggedInDto: LoggedInDto): TokensDto {
    const accessToken = this.jwtService.sign(loggedInDto, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '10m',
    });

    const refreshToken = this.jwtService.sign(loggedInDto, {
      secret: process.env.REFRESH_JWT_SECRET,
      expiresIn: process.env.REFRESH_JWT_EXPIRES_IN || '30m',
    });

    return { accessToken, refreshToken };
  }
}
