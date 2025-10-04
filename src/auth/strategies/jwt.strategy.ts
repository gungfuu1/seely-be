import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { LoggedInDto } from '../dto/logged-in.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'changeme',
    });
  }

  async validate(payload: any): Promise<LoggedInDto> {
    console.log('JWT Payload (validate):', payload); // ✅ debug

    return {
      id: payload.id,                 // ✅ เพิ่ม id กลับมา
      username: payload.username,
      role: payload.role,
      firstName: payload.firstName,   // ✅ เพิ่มเผื่อ FE ใช้
      lastName: payload.lastName,
      email: payload.email,
    };
  }
}
