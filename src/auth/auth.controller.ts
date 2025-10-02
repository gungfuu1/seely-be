import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { LoggedInDto } from './dto/logged-in.dto';
import { KeycloakService } from './keycloak.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly keycloakService: KeycloakService,
  ) {}

  // ================= Local Login =================
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.login(loginDto);

    res.cookie('refreshToken', refreshToken);
    return { accessToken };
  }

  @UseGuards(AuthGuard('refresh-jwt'))
  @Post('refresh-token')
  refreshToken(@Req() req: { user: LoggedInDto }) {
    return this.authService.refreshToken(req.user);
  }

  // ================= Logout (Local + Keycloak) =================
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    // ลบ cookie ฝั่ง BE
    res.clearCookie('refreshToken');
    res.clearCookie('idToken');

    // ส่ง URL กลับไปให้ FE ใช้ redirect
    return {
      logoutUrl:
        process.env.OAUTH2_POST_LOGOUT_REDIRECT_URI || 'http://localhost:4200/',
    };
  }

  // ================= Keycloak Login =================
  @Get('login/keycloak')
  @Redirect()
  keycloakLogin() {
    const client_id = process.env.OAUTH2_CLIENT_ID;
    const redirect_uri = encodeURIComponent(
      process.env.OAUTH2_REDIRECT_URI || '',
    );
    const scope = process.env.OAUTH2_SCOPE || 'openid email profile';

    // 👇 บังคับ Keycloak ให้ถามรหัสใหม่ทุกครั้ง
    const url =
      `${process.env.OAUTH2_ISSUER}/protocol/openid-connect/auth?` +
      `client_id=${client_id}&scope=${scope}&response_type=code&redirect_uri=${redirect_uri}&prompt=login`;

    return { url, statusCode: 302 };
  }

  // ================= Keycloak Callback =================
  @Get('callback/keycloak')
  @Redirect()
  async keycloakCallback(@Query('code') code: string) {
    if (!code) {
      throw new UnauthorizedException('Missing code from Keycloak');
    }

    // แลก code → token
    const tokenResponse = await this.authService.exchangeCodeForToken(code);
    const userInfo = await this.authService.getUserFromToken(
      tokenResponse.access_token,
    );

    // บันทึก user ลง DB
    const user = await this.authService.saveUserFromKeycloak(userInfo);

    // redirect กลับไป FE พร้อม token + user
    return {
      url: `http://localhost:4200?token=${tokenResponse.access_token}&firstName=${encodeURIComponent(
        userInfo.given_name || userInfo.preferred_username,
      )}`,
      statusCode: 302,
    };
  }
}
