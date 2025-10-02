import { Controller, Get, Query, Res, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth/callback') // 👈 ต้องใส่ prefix ให้ตรง
export class KeycloakController {
  constructor(private readonly authService: AuthService) {}

  @Get('keycloak')
  async keycloakCallback(@Query('code') code: string, @Res() res: Response) {
    if (!code) {
      throw new UnauthorizedException('Missing code from Keycloak');
    }

    const tokenResponse = await this.authService.exchangeCodeForToken(code);
    const userInfo = await this.authService.getUserFromToken(tokenResponse.access_token);
    const tokens = await this.authService.handleKeycloakLogin(userInfo);

    return res.redirect(
      `http://localhost:4200/login?token=${tokens.accessToken}&user=${encodeURIComponent(
        userInfo.preferred_username,
      )}`,
    );
  }
}
