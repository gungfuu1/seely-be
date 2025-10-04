import { UsersService } from '@app/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { TokensDto } from './dto/tokens.dto';
import bcrypt from 'bcrypt';
import { LoggedInDto } from './dto/logged-in.dto';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Role } from '@app/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // ========== Local Login ==========
  async login(loginDto: LoginDto): Promise<TokensDto> {
    const user = await this.usersService.findByUsername(loginDto.username);

    if (!user) {
      throw new UnauthorizedException(`user not found: ${loginDto.username}`);
    }

    const matched = await bcrypt.compare(loginDto.password, user.password ?? '');
    if (!matched) {
      throw new UnauthorizedException(
        `wrong password: username=${loginDto.username}`,
      );
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

  // ========== JWT Generate ==========
  generateTokens(loggedInDto: LoggedInDto): TokensDto {
    const accessToken = this.jwtService.sign(loggedInDto, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '10m',
    });

    const refreshTokenOpts: JwtSignOptions = {
      secret: process.env.REFRESH_JWT_SECRET,
      expiresIn: process.env.REFRESH_JWT_EXPIRES_IN || '30m',
    };
    const refreshToken = this.jwtService.sign(loggedInDto, refreshTokenOpts);

    return { accessToken, refreshToken };
  }

  refreshToken(loggedInDto: LoggedInDto): { accessToken: string } {
    const accessToken = this.jwtService.sign(loggedInDto, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '10m',
    });
    return { accessToken };
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

  // ========= Handle Keycloak Login =========
  async handleKeycloakLogin(userInfo: any): Promise<TokensDto> {
    let user = await this.usersService.findByUsername(
      userInfo.preferred_username,
    );

    if (!user) {
      user = await this.usersService.create({
        username: userInfo.preferred_username,
        keycloakId: userInfo.sub,
        email: userInfo.email,
        firstName: userInfo.given_name || '',
        lastName: userInfo.family_name || '',
        role: Role.USER,
        password: '', // dummy password
      } as any);
    } else {
      user = await this.usersService.update(user.id, {
        keycloakId: userInfo.sub,
        email: userInfo.email,
        firstName: userInfo.given_name || '',
        lastName: userInfo.family_name || '',
      });
    }

    if (!user) {
      throw new UnauthorizedException('Failed to create or update user');
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

  // ========= Save User From Keycloak =========
  async saveUserFromKeycloak(userInfo: any) {
    const username = userInfo.preferred_username;
    const keycloakId = userInfo.sub;

    let user = await this.usersService
      .findByKeycloakId(keycloakId)
      .catch(() => null);

    if (!user) {
      user = await this.usersService.create({
        username,
        keycloakId,
        email: userInfo.email || null,
        firstName: userInfo.given_name || null,
        lastName: userInfo.family_name || null,
        role: Role.USER,
        password: '', // dummy password
      });
    } else {
      user.email = userInfo.email || user.email;
      user.firstName = userInfo.given_name || user.firstName;
      user.lastName = userInfo.family_name || user.lastName;
      await this.usersService.update(user.id, user);
    }

    return user;
  }

  // ========= Generate Internal Token หลัง Keycloak =========
  async generateInternalToken(userInfo: any): Promise<TokensDto> {
    const user = await this.usersService.findByUsername(userInfo.preferred_username);

    if (!user) {
      throw new UnauthorizedException('User not found');
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
}
