import { Body, Controller, Get, Post, Redirect, Req, Res, UseGuards, Query, UnauthorizedException } from '@nestjs/common';
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
    private readonly keycloakService: KeycloakService) {}

  @Get('login')
  @Redirect('https://docs.nestjs.com', 302)
  getLoginInfo(@Req() req: Request) {
    const idToken = req.cookies?.idToken
    const client_id = process.env.OAUTH2_CLIENT_ID
    const redirect_uri = encodeURI(process.env.OAUTH2_REDIRECT_URI|| "" )
    const url = "https://sso-dev.odd.works/realms/pea-devpool-2025/protocol/openid-connect/auth?client_id="+client_id+"&scope=openid%20email%20profile&response_type=code&redirect_uri=" + redirect_uri
    //redirect to keycloak login with url
    return { url, statusCode: 302 };
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { accessToken, refreshToken } = await this.authService.login(loginDto);

    res.cookie('refreshToken', refreshToken)
    
    return { accessToken }
  }

  @UseGuards(AuthGuard('refresh-jwt'))
  @Post('refresh-token')
  refreshToken(@Req() req: { user: LoggedInDto}) {
    // return new accessToken
    return this.authService.refreshToken(req.user)
  }
  
  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken');

    const idToken = req.cookies?.idToken
    if (idToken) {
      const logoutUrl = await this.keycloakService.logout(idToken)
      res.clearCookie('idToken')
      return { logoutUrl }
    }

    return { logoutUrl: null }
  }


  // =============== Keycloak Login ===============
  @Get('login/keycloak')
  @Redirect()
  keycloakLogin() {
    const client_id = process.env.OAUTH2_CLIENT_ID;
    const redirect_uri = encodeURI(process.env.OAUTH2_REDIRECT_URI || '');
    const url =
      `${process.env.OAUTH2_ISSUER}/protocol/openid-connect/auth?` +
      `client_id=${client_id}&scope=openid%20email%20profile&response_type=code&redirect_uri=${redirect_uri}`;
    return { url, statusCode: 302 };
  }

  // =============== Keycloak Callback ===============
  @Get('callback/keycloak')
  async keycloakCallback(@Query('code') code: string, @Res() res: Response) {
    if (!code) {
      throw new UnauthorizedException('Missing code from Keycloak');
    }

    // แลก code เป็น token
    const tokenResponse = await this.authService.exchangeCodeForToken(code);

    // ดึง user info จาก token
    const userInfo = await this.authService.getUserFromToken(
      tokenResponse.access_token,
    );

    // TODO: จะบันทึก user ลง DB หรือเช็ค existing user ก็ทำตรงนี้
    // เช่น call UsersService.createOrUpdate(userInfo)

    // redirect กลับไป FE พร้อม query params
    return res.redirect(
      `http://localhost:4200?token=${tokenResponse.access_token}&user=${encodeURIComponent(userInfo.preferred_username)}`,
    );
  }
}