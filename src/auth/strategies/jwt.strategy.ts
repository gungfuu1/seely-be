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
      secretOrKey: process.env.JWT_SECRET || 'default-secret', // ต้องตรงกับตอน sign
    });
  }

  async validate(payload: any): Promise<LoggedInDto> {
    console.log('JWT Payload:', payload); // ✅ debug ดู payload
    return { username: payload.username, role: payload.role };
  }
}
