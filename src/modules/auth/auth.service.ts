import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { JWT_Payload_I } from './interfaces';
import { JwtService } from '@nestjs/jwt';
import { _Response_I } from '../../core/interfaces';
import { AuthRepositoryService } from './entities';

import * as bcrypt from 'bcrypt';
import { TempoHandler } from '../../core/classes/TempoHandler';
import { envs } from '../../core/config/envs';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { EntityManager } from '@mikro-orm/core';
import { ExceptionsHandler } from '../../core/helpers';
import { NATS_SERVICE } from '../../core/config/services';
import { UserService_GW } from '../user/user.service';
import { LoginAuth_Dto, RegisterAuth_Dto } from './dto';

@Injectable()
export class AuthService {

    private readonly logger = new Logger('AuthService');

    ExceptionsHandler = new ExceptionsHandler();

    constructor(
        private readonly jwtService: JwtService,
        private readonly _AuthRepositoryService: AuthRepositoryService,
        private readonly em: EntityManager,

        private readonly _UserService_GW: UserService_GW

    ) {

    }

    async signJWT(payload: JWT_Payload_I) {
        return this.jwtService.sign(payload)
    }

    async verifyToken(token: string) {

           try {

              const { sub, iat, exp, ...user } = this.jwtService.verify(token, {
                  secret: envs.jwtSecret
              });

              return {
                  user,
                  token: await this.signJWT(user)
              }

          } catch (error) {

            this.logger.error(`[ Verify token ] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, 'AuthService.verifyToken');

          }
    }

    async update_last_session(email: string, f_em: EntityManager) {

        try {

            const user = await this.find_auth_by_email(email, f_em);

            if (!user) {
                this.logger.warn(`[Update last session] El usuario ${email} no existe`);
                return;
            }

            const last_session = new TempoHandler().date_now();

            await this._AuthRepositoryService.nativeUpdate(user, {
                last_session: last_session
            });

            return {
                ...user,
                last_session
            }

        } catch (error) {

            this.logger.error(`[Update last session] Error: ${error}`);

            this.ExceptionsHandler.EmitException(error, 'AuthService.update_last_session');

        }

    }

    async find_auth_by_email(email: string, f_em: EntityManager) {

        const user = await this._AuthRepositoryService.find_one({email}, f_em);
        return user;

    }


    async login(LoginAuth_Dto: LoginAuth_Dto) {

        let _Response: _Response_I;
        const {
            email,
            password,
        } =LoginAuth_Dto;

        try {

            const f_em = this.em.fork();
            const user = await this.find_auth_by_email(email, f_em);

            if (!user) {
                this.logger.warn(`[Login user] El usuario ${email} no existe`);
                _Response = {
                    ok: false,
                    statusCode: HttpStatus.NOT_FOUND,
                    message: `El usuario ${email} no existe`,
                    data: null
                }

              throw new RpcException(_Response)
            }

            const isPassValid = bcrypt.compareSync(password, user.password);

            if (!isPassValid) {
                // this.logger.warn(`[Login user] Password no valido`);
                _Response = {
                    ok: false,
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: `Password no valido`,
                    data: null
                }

                return _Response;
            }

            const now_user =  await this.update_last_session(email, f_em);

            const {
                password: ___,
                ...rest
            } = now_user;

            _Response = {
                ok: true,
                statusCode: HttpStatus.OK,
                message: 'Sesión iniciada, bienvenido',
                data: {
                    user: rest,
                    token: await this.signJWT(rest)
                },

            }

        } catch (error) {

            this.logger.error(`[Login user] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, 'AuthService.login');

        }

        return _Response;

    }

    async create_auth(RegisterAuth_Dto: RegisterAuth_Dto) {

        let _Response: _Response_I;

        const {
            email,
            name,
            last_name,
            password,
        } = RegisterAuth_Dto;

        try {

            const f_em = this.em.fork();
            const auth = await this.find_auth_by_email(email, f_em);

            if (auth) {
                _Response = {
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: `El usuario ${email} ya existe`,
                }
                throw new RpcException(_Response)
            }

            let new_auth = await this._AuthRepositoryService.create_auth({
                email,
                password: bcrypt.hashSync(password, 10),
                user: '-'
            }, f_em);

            const new_user = await this._UserService_GW.create_user( {
                auth: new_auth._id,
                name,
                last_name
            } );

            new_auth = await this._AuthRepositoryService.update_auth(new_auth, {
                user: new_user.data._id
            }, f_em);

            _Response = {
                ok: true,
                statusCode: HttpStatus.CREATED,
                message: 'Usuario registrado',
                data: {
                    ...new_auth,
                    password: '********',
                    user: { ...new_user.data }
                }
            }

        } catch (error) {

            this.logger.error(`[Register user] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, 'AuthService.registerUser');

        }

        return _Response;



    }

}
