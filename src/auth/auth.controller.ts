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

  // ========= Local login =========
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.login(loginDto);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
    });
    return { accessToken };
  }

  @UseGuards(AuthGuard('refresh-jwt'))
  @Post('refresh-token')
  refreshToken(@Req() req: { user: LoggedInDto }) {
    return this.authService.refreshToken(req.user);
  }

  // ========= Keycloak Login =========
  @Get('login/keycloak')
@Redirect()
keycloakLogin() {
  const client_id = process.env.OAUTH2_CLIENT_ID;
  const redirect_uri = encodeURIComponent(process.env.OAUTH2_REDIRECT_URI || '');
  const scope = process.env.OAUTH2_SCOPE || 'openid email profile';

  const url =
    `${process.env.OAUTH2_ISSUER}/protocol/openid-connect/auth?` +
    `client_id=${client_id}&scope=${scope}&response_type=code&redirect_uri=${redirect_uri}` +
    `&prompt=login`; 

  return { url, statusCode: 302 };
}


  // ========= Keycloak Callback =========
  @Get('callback/keycloak')
  @Redirect()
  async keycloakCallback(@Query('code') code: string, @Res({ passthrough: true }) res: Response) {
    if (!code) throw new UnauthorizedException('Missing code from Keycloak');

    // 1) แลก code เป็น token
    const tokenResponse = await this.authService.exchangeCodeForToken(code);

    // 2) ดึง userinfo
    const userInfo = await this.authService.getUserFromToken(tokenResponse.access_token);

    // 3) save/update user
    const user = await this.authService.saveUserFromKeycloak(userInfo);

    // 4) เก็บ id_token ลง cookie
    if (tokenResponse.id_token) {
  res.cookie('idToken', tokenResponse.id_token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,  
    path: '/',
  });
}

    // 5) ออก internal token แล้ว redirect กลับ FE
    const internalTokens = await this.authService.generateInternalToken(userInfo);

    return {
      url: `http://localhost:4200?token=${internalTokens.accessToken}&firstName=${encodeURIComponent(
        user.firstName || userInfo.given_name || userInfo.preferred_username || '',
      )}`,
      statusCode: 302,
    };
  }

  // ========= Single Logout =========
  // ใช้ GET เพื่อให้ FE นำทาง ผู้ใช้ไปยัง URL นี้
  @Get('logout')
async logoutGet(@Req() req: Request, @Res() res: Response) {
  const idToken = req.cookies?.idToken;
  res.clearCookie('refreshToken');
  res.clearCookie('idToken');

  const postLogoutRedirect =
    process.env.OAUTH2_POST_LOGOUT_REDIRECT_URI || 'http://localhost:4200/';

  const logoutUrl =
    `${process.env.OAUTH2_ISSUER}/protocol/openid-connect/logout?` +
    (idToken ? `id_token_hint=${encodeURIComponent(idToken)}&` : '') +
    `post_logout_redirect_uri=${encodeURIComponent(postLogoutRedirect)}`;

  return res.redirect(logoutUrl);
}

}
