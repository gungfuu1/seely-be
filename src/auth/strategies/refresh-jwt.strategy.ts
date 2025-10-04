import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { LoggedInDto } from '../dto/logged-in.dto';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.REFRESH_JWT_SECRET || 'changeme-refresh',
    });
  }

  async validate(payload: any): Promise<LoggedInDto> {
    console.log('Refresh JWT Payload:', payload);

    // ✅ ต้อง return id ด้วยเสมอ
    return {
      id: payload.id,                 // เพิ่ม id ให้ครบ
      username: payload.username,
      role: payload.role,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
    };
  }
}
