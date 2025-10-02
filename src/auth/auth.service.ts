import { UsersService } from '@app/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { TokensDto } from './dto/tokens.dto';
import bcrypt from 'bcrypt';
import { LoggedInDto } from './dto/logged-in.dto';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<TokensDto> {
    // find by username
    const user = await this.usersService.findByUsername(loginDto.username);

    // compare hashed-password
    const matched = await bcrypt.compare(loginDto.password, user.password);
    if (!matched) {
      throw new UnauthorizedException(
        `wrong password: username=${loginDto.username}`,
      );
    }
    // return token
    const loggedInDto: LoggedInDto = {
      username: user.username,
      role: user.role,
    };

    return this.generateTokens(loggedInDto);
  }

  generateTokens(loggedInDto: LoggedInDto): TokensDto {
    // gen accessToken
    const accessToken = this.jwtService.sign(loggedInDto);

    // gen refreshToken
    const refreshTokenOpts: JwtSignOptions = {
      secret: process.env.REFRESH_JWT_SECRET,
      expiresIn: process.env.REFRESH_JWT_EXPIRES_IN,
    };
    const refreshToken = this.jwtService.sign(loggedInDto, refreshTokenOpts);

    return { accessToken, refreshToken };
  }

  refreshToken(loggedInDto: LoggedInDto): { accessToken: string} {
    console.log('loggedInDto', loggedInDto)
    const accessToken = this.jwtService.sign(loggedInDto);
    return { accessToken }
  }


  // ========== Keycloak Flow ==========
  async exchangeCodeForToken(code: string) {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', process.env.OAUTH2_CLIENT_ID || '');
    params.append('client_secret', process.env.OAUTH2_CLIENT_SECRET || '');
    params.append('code', code);
    params.append('redirect_uri', process.env.OAUTH2_REDIRECT_URI || '');

    const res = await fetch(
      `${process.env.OAUTH2_ISSUER}/protocol/openid-connect/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
      },
    );

    if (!res.ok) {
      throw new UnauthorizedException('Failed to exchange code for token');
    }
    return res.json();
  }

  async getUserFromToken(accessToken: string) {
    const res = await fetch(
      `${process.env.OAUTH2_ISSUER}/protocol/openid-connect/userinfo`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    if (!res.ok) {
      throw new UnauthorizedException('Failed to fetch user info');
    }
    return res.json();
  }

}
