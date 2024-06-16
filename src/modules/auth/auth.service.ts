import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JWT_Payload_I } from './interfaces';
import { JwtService } from '@nestjs/jwt';
import { LoginUser_Dto, RegisterUser_Dto } from './dto';
import { _Response_I } from '../../core/interfaces';
import { AuthRepositoryService } from './entities';

import * as bcrypt from 'bcrypt';
import { TempoHandler } from '../../core/classes/TempoHandler';
import { envs } from '../../core/config/envs';
import { RpcException } from '@nestjs/microservices';
import { EntityManager } from '@mikro-orm/core';
import { ExceptionsHandler } from '../../core/helpers';

@Injectable()
export class AuthService {


    private readonly logger = new Logger('AuthService');

    ExceptionsHandler = new ExceptionsHandler();

    constructor(
        private readonly jwtService: JwtService,
        private readonly _AuthRepositoryService: AuthRepositoryService,
        private readonly em: EntityManager
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

            const user = await this.find_user_by_email(email, f_em);

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

    async find_user_by_email(email: string, f_em: EntityManager) {

        const user = await this._AuthRepositoryService.find_one({email}, f_em);
        return user;

    }


    async login(LoginUser_Dto: LoginUser_Dto) {

        let _Response: _Response_I;
        const {
            email,
            password,
        } = LoginUser_Dto;

        try {

            const f_em = this.em.fork();
            const user = await this.find_user_by_email(email, f_em);

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
                message: 'User logged',
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

    async registerUser(RegisterUser_Dto: RegisterUser_Dto) {

        let _Response: _Response_I;

        const {
            email,
            name,
            password,
        } = RegisterUser_Dto;

        try {

            const f_em = this.em.fork();
             const user = await this.find_user_by_email(email, f_em);

            if (user) {
                _Response = {
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: `El usuario ${email} ya existe`,
                }
                throw new RpcException(_Response)
            }

            const new_user = await this._AuthRepositoryService.create_user({
                email,
                password: bcrypt.hashSync(password, 10)
            }, f_em);

            _Response = {
                ok: true,
                statusCode: HttpStatus.CREATED,
                message: 'User created',
                data: {
                    ...new_user,
                    password: '********'
                }
            }

        } catch (error) {

            this.logger.error(`[Register user] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, 'AuthService.registerUser');

        }

        return _Response;



    }

}
