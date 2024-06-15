

import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Request } from 'express';

import { firstValueFrom } from 'rxjs';
import { envs } from '../config/envs';
import { JWT_Payload_I } from '../../modules/auth/interfaces';

@Injectable()
export class Auth_Guard implements CanActivate {

    constructor(
        // @Inject(NATS_SERVICE) private readonly client: ClientProxy
           private readonly jwtService: JwtService
    ){

    }

   async signJWT(payload: JWT_Payload_I){
        return this.jwtService.sign(payload)
    }


    async canActivate(context: ExecutionContext): Promise<boolean> {

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {

            throw new UnauthorizedException('Token not found');

        }

        try {

            // const {user, token: newToken } = await firstValueFrom(
            //     this.client.send('auth.verify.user', token)
            // )

            const { sub, iat, exp, ...user } = this.jwtService.verify(token, {
                secret: envs.jwtSecret
            });

            request['user'] = user
            request['token'] = token;

            // return {
            //     user,
            //     token: await this.signJWT(user)
            // }


        } catch {

            throw new UnauthorizedException();

        }

        return true;

    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

}