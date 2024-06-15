import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

// import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';


import { JWT_Payload_I } from '../interfaces';
import { envs } from '../../../core/config/envs';
import { AuthRepositoryService } from '../entities';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {


    constructor(
        private readonly _AuthRepositoryService: AuthRepositoryService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: envs.jwtSecret,
        });
    }

    async validate(payload: JWT_Payload_I) {

        const { email } = payload;

        const user = await this._AuthRepositoryService.findOne({ email });

        if (!user) {
            throw new UnauthorizedException();
        }

        return payload;

    }
}


