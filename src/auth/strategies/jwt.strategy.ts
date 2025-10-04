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
    console.log('JWT Payload (validate):', payload); 
    return {
      id: payload.id,                 
      username: payload.username,
      role: payload.role,
      firstName: payload.firstName,   
      lastName: payload.lastName,
      email: payload.email,
    };
  }
}
