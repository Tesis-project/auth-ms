
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { _Response_I } from '@tesis-project/dev-globals/dist/core/interfaces';
import { Create_Password_Request_Dto, Create_Request_Key_Dto, Accept_Password_Request_Dto, Auth_User_I_Dto } from '@tesis-project/dev-globals/dist/modules/auth/dto';
import { Requests_Ety } from '../entities/requests.entity';
import { ExceptionsHandler } from '../../../core/helpers';
import { EntityManager } from '@mikro-orm/core';
import { Requests_Repository } from '../entities/requests.repository.service';

import { Auth_Ety } from '../../auth/entities/auth.entity';
import { RpcException } from '@nestjs/microservices';
import { RequestStatus_Enum, RequestType_Enum } from '@tesis-project/dev-globals/dist/modules/auth/interfaces/requests';
import { Requests_Auth_Service } from './requests-auth.service';
import { TempoHandler } from '@tesis-project/dev-globals/dist/core/classes';

import * as keygen from 'keygen';

@Injectable()
export class RequestsService {

    private readonly logger = new Logger('RequestsService');
    ExceptionsHandler = new ExceptionsHandler();
    service: string = 'RequestsService';

    constructor(
        private readonly _Requests_Repository: Requests_Repository,
        private readonly _Requests_Auth_Service: Requests_Auth_Service,
        private readonly em: EntityManager,
    ) {

    }

    async create_password_request(create_request_dto: Create_Password_Request_Dto): Promise<_Response_I> {

        let _Response: _Response_I;

        const {
            email
        } = create_request_dto;

        try {

            const f_em = this.em.fork();
            const _Auth_Repository = f_em.getRepository(Auth_Ety);

            const get_auth = await _Auth_Repository.findOne({
                email
            });

            if (get_auth) {

                const request = await this._Requests_Repository.create_requests({
                    save: {
                        type: RequestType_Enum.RESET_PASSWORD,
                        key: keygen.url(100),
                        auth: get_auth
                    },
                    _em: f_em
                });

                f_em.flush();

            }

            _Response = {
                ok: true,
                statusCode: 201,
                message: `Si el correo ${email} existe, se ha enviado un correo con las instrucciones para restablecer la contraseña`,
                data: null
            }

        } catch (error) {

            this.logger.error(`[Create password request] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.create_password_request`);

        }

        return _Response;

    }

    async create_request(create_request_dto: Create_Request_Key_Dto, user_auth: Partial<Auth_User_I_Dto>): Promise<_Response_I<Requests_Ety>> {

        let _Response: _Response_I<Requests_Ety>;

        const {
            detail,
            type
        } = create_request_dto;

        try {

            const f_em = this.em.fork();
            const _Auth_Repository = f_em.getRepository(Auth_Ety);

            const key = keygen.url(100);

            const get_auth = await _Auth_Repository.findOne({
                _id: user_auth._id
            })

            const request = await this._Requests_Repository.create_requests({
                save: {
                    detail: detail || '',
                    type,
                    key,
                    auth: get_auth
                },
                _em: f_em
            });

            f_em.flush();

            _Response = {
                ok: true,
                statusCode: 201,
                message: 'Solicitud creada',
                data: {
                    ...request,
                    auth: {
                        _id: get_auth._id
                    } as any
                }
            }


        } catch (error) {

            this.logger.error(`[Create request] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.create_request`);

        }

        return _Response;

    }

    async get_request(key: string): Promise<_Response_I<Requests_Ety>> {

        let _Response: _Response_I<Requests_Ety>;

        try {

            const request = await this._Requests_Repository.findOne({
                key
            });

            if (!request) {
                throw new RpcException({
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Solicitud no encontrada'
                })
            }

            _Response = {
                ok: true,
                statusCode: 200,
                message: 'Solicitud encontrada',
                data: {
                    ...request
                }
            }

        } catch (error) {

            this.logger.error(`[Get request] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.get_request`);

        }

        return _Response;

    }

    async verify_request(key: string): Promise<_Response_I<Requests_Ety>> {

        let _Response: _Response_I<Requests_Ety>;

        try {

            const f_em = this.em.fork();
            const request = await this._Requests_Repository.findOne({
                key
            },
                {
                    populate: ['auth']
                }
            );

            if (!request) {
                throw new RpcException({
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Solicitud no encontrada'
                })
            }
            if (request.status === RequestStatus_Enum.USED) {
                throw new RpcException({
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Solicitud ya utilizada'
                })
            }
            if (!(request.type === RequestType_Enum.CONFIRM_ACCOUNT || request.type === RequestType_Enum.CHANGE_EMAIL)) {
                throw new RpcException({
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Tipo de solicitud no permitida'
                })
            }

            let resp_auth: _Response_I<Auth_Ety>;

            if (request.type === RequestType_Enum.CONFIRM_ACCOUNT) {

                resp_auth = await this._Requests_Auth_Service.accept_confirmAccountRequest(request.auth, f_em);
                _Response = {
                    ok: resp_auth.ok,
                    statusCode: resp_auth.statusCode,
                    message: resp_auth.message
                }

            }

            if (request.type === RequestType_Enum.CHANGE_EMAIL) {

                resp_auth = await this._Requests_Auth_Service.accept_emailRequest(request.detail, request.auth, f_em);
                _Response = {
                    ok: resp_auth.ok,
                    statusCode: resp_auth.statusCode,
                    message: resp_auth.message
                }

            }

            request.status = RequestStatus_Enum.USED;
            request.used_at = new TempoHandler().date_now(),

                await this._Requests_Repository.update_requests({
                    find: { _id: request._id },
                    update: request,
                    _em: f_em
                });

            f_em.flush();

            delete request.auth;

            _Response = {
                ..._Response,
                data: {
                    ...request
                }
            }

        } catch (error) {

            this.logger.error(`[Verify request] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.verify_request`);

        }

        return _Response;

    }

    async verify_pass_request(key: string, Accept_Password_Request_Dto: Accept_Password_Request_Dto): Promise<_Response_I<Requests_Ety>> {

        let _Response: _Response_I<Requests_Ety>;

        try {

            const f_em = this.em.fork();
            const request = await this._Requests_Repository.findOne(
                {
                    key
                },
                {
                    populate: ['auth']
                }
            );

            if (!request) {
                throw new RpcException({
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Solicitud no encontrada'
                })
            }
            if (request.status === RequestStatus_Enum.USED) {
                throw new RpcException({
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Solicitud ya utilizada'
                })
            }

            let resp_auth: _Response_I<Auth_Ety>;

            if (request.type === RequestType_Enum.RESET_PASSWORD) {

                resp_auth = await this._Requests_Auth_Service.accept_passwordRequest(Accept_Password_Request_Dto.password, request.auth, f_em);
                _Response = {
                    ok: resp_auth.ok,
                    statusCode: resp_auth.statusCode,
                    message: resp_auth.message
                }

                request.status = RequestStatus_Enum.USED;
                request.used_at = new TempoHandler().date_now(),

                    await this._Requests_Repository.update_requests({
                        find: { _id: request._id },
                        update: request,
                        _em: f_em
                    });

                f_em.flush();

                _Response = {
                    ..._Response,
                    data: {
                        ...request
                    }
                }

            } else {
                throw new RpcException({
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Tipo de solicitud no permitida'
                })
            }

        } catch (error) {

            this.logger.error(`[Verify pass request] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.verify_pass_request`);

        }

        return _Response;

    }

}
