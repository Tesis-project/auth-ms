
import {
    LoginAuth_Dto,
    RegisterAuth_Dto
} from "@tesis-project/dev-globals/dist/modules/auth/dto"

import { TempoHandler } from "@tesis-project/dev-globals/dist/core/classes"
import { _Response_I } from '@tesis-project/dev-globals/dist/core/interfaces';

import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import { Injectable, Logger, HttpStatus } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { RpcException } from "@nestjs/microservices";
import { envs } from "../../../core/config/envs";
import { UserService_GW } from "../../user/user.service";
import { Auth_Ety, AuthRepositoryService } from "../entities";
import { JWT_Payload_I } from "../interfaces";

import { ExceptionsHandler } from "../../../core/helpers";
import { RequestsService } from "../../requests/services";
import { RequestType_Enum } from "@tesis-project/dev-globals/dist/modules/auth/interfaces/requests";
import { Notifications_Emailing_Service_GW, Notifications_Service_GW } from "../../notifications";

import * as uuid from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    private readonly logger = new Logger('AuthService');

    ExceptionsHandler = new ExceptionsHandler();

    constructor(
        private readonly jwtService: JwtService,
        private readonly _AuthRepositoryService: AuthRepositoryService,
        private readonly _RequestsService: RequestsService,
        private readonly em: EntityManager,
        private readonly _EmailingService_GW: Notifications_Emailing_Service_GW,
        private readonly _NotificationsService_GW: Notifications_Service_GW,
        private readonly _UserService_GW: UserService_GW

    ) {

    }

    async signJWT(payload: JWT_Payload_I) {
        return this.jwtService.sign(payload)
    }

    async verifyToken(token: string) {

        let _Response: _Response_I;

        try {

            const { sub, iat, exp, ...user } = this.jwtService.verify(token, {
                secret: envs.jwtSecret
            });

            _Response = {
                ok: true,
                statusCode: HttpStatus.OK,
                message: 'Token verificado',
                data: {
                    ...user,
                    token: await this.signJWT(user)
                },

            }

        } catch (error) {

            this.logger.error(`[ Verify token ] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, 'AuthService.verifyToken');

        }

        return _Response;
    }

    async update_last_session(email: string, f_em: EntityManager<IDatabaseDriver<Connection>> ): Promise<Auth_Ety> {

        try {

            const user = await this.find_auth_by_email(email);

            if (!user) {
                this.logger.warn(`[Update last session] El usuario ${email} no existe`);
                return;
            }

            const last_session = new TempoHandler().date_now();

            const now_user = await this._AuthRepositoryService.update_auth({
                find: { _id: user._id },
                update: { last_session },
                _em: f_em
            })

            return {
                ...now_user
            }

        } catch (error) {

            this.logger.error(`[Update last session] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, 'AuthService.update_last_session');

        }

    }

    async find_auth_by_email(email: string) {

        const user = await this._AuthRepositoryService.findOne({ email });
        return user;

    }

    async login(LoginAuth_Dto: LoginAuth_Dto) {

        let _Response: _Response_I;
        const {
            email,
            password,
        } = LoginAuth_Dto;

        try {

            const f_em = this.em.fork();
            const user = await this.find_auth_by_email(email);

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
                _Response = {
                    ok: false,
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: `Password no valido`,
                    data: null
                }
                return _Response;
            }

            const now_user = await this.update_last_session(email, f_em);

            f_em.flush();

            const {
                password: ___,
                ...rest
            } = now_user;

            _Response = {
                ok: true,
                statusCode: HttpStatus.OK,
                message: 'Sesión iniciada, bienvenido',
                data: {
                    ...rest,
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
            role
        } = RegisterAuth_Dto;

        if (role === 'ADMIN_ROLE') {
            _Response = {
                ok: false,
                data: null,
                statusCode: HttpStatus.BAD_REQUEST,
                message: `Rol no permitido`,
            }
            throw new RpcException(_Response)
        }

        try {

            const f_em = this.em.fork();
            const auth = await this.find_auth_by_email(email);

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
                save: {
                    _id: uuid.v4(),
                    email,
                    role,
                    password: bcrypt.hashSync(password, 10),
                    user: uuid.v4()
                },
                _em: f_em
            })

            f_em.flush();

            const new_user = await this._UserService_GW.create_user({
                auth: new_auth._id,
                name,
                last_name
            });

            new_auth = await this._AuthRepositoryService.update_auth({
                find: { _id: new_auth._id },
                update: { user: new_user.data._id },
                _em: f_em
            });

            const request = await this._RequestsService.create_request(
                { type: RequestType_Enum.CONFIRM_ACCOUNT, detail: '' },
                {
                    _id: new_auth._id
                }
            );

            await this._EmailingService_GW.send_email({
                to: email,
                confirm_account: {
                    key: request.data.key,
                    name: new_user.data.name,
                }
            })

            await this._NotificationsService_GW.create_notification( {
                subject: `Bienvenido ${new_user.data.name} ${new_user.data.last_name}`,
                message: `Te damos la bienvenida a nuestra plataforma, esperamos que disfrutes de nuestros servicios`,
                user: new_user.data._id
            })

            f_em.flush();

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

            this.logger.error(`[Register auth] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, 'AuthService.create_auth');

        }

        return _Response;

    }

}
