
import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import { Injectable, Logger } from "@nestjs/common";
import { Auth_Ety } from "../../auth/entities";
import { _Response_I } from "@tesis-project/dev-globals/dist/core/interfaces";
import { AuthStatus_Enum } from "@tesis-project/dev-globals/dist/modules/auth/interfaces";
import { ExceptionsHandler } from "../../../core/helpers";

import { Accept_Password_Request_Dto } from '@tesis-project/dev-globals/dist/modules/auth/dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class Requests_Auth_Service {

    private readonly logger = new Logger('Requests_Auth_Service ');
    ExceptionsHandler = new ExceptionsHandler();

    service: string = 'Requests_Auth_Service ';

    constructor(
        private readonly em: EntityManager,
    ) {

    }

    async accept_emailRequest(new_email: string, auth: Auth_Ety, f_em: EntityManager<IDatabaseDriver<Connection>>): Promise<_Response_I<Auth_Ety>> {

        let _Response: _Response_I;

        try {

            const _Auth_Repository = f_em.getRepository(Auth_Ety);

            auth.email = new_email;

            await _Auth_Repository.update_auth({
                find: { _id: auth._id },
                update: auth,
                _em: f_em
            });

            // f_em.flush();

            _Response = {
                ok: true,
                statusCode: 201,
                message: 'Email actualizado',
                data: {
                    ...auth
                }
            }

        } catch (error) {

            this.logger.error(`[Accept email request] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.accept_emailRequest`);

        }

        return _Response;

    }

    async accept_confirmAccountRequest(auth: Auth_Ety, f_em: EntityManager<IDatabaseDriver<Connection>>): Promise<_Response_I<Auth_Ety>> {

        let _Response: _Response_I;

        try {

            const _Auth_Repository = f_em.getRepository(Auth_Ety);

            auth.status = AuthStatus_Enum.VERIFIED;

            await _Auth_Repository.update_auth({
                find: { _id: auth._id },
                update: auth,
                _em: f_em
            });

            _Response = {
                ok: true,
                statusCode: 201,
                message: 'Cuenta verificada',
                data: {
                    ...auth
                }
            }

        } catch (error) {

            this.logger.error(`[Accept confirm account request] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.accept_confirmAccountRequest`);

        }

        return _Response;

    }

    async accept_passwordRequest(password: string, auth: Auth_Ety, f_em: EntityManager<IDatabaseDriver<Connection>>): Promise<_Response_I<Auth_Ety>> {

        let _Response: _Response_I;

        try {

            const f_em = this.em.fork();
            const _Auth_Repository = f_em.getRepository(Auth_Ety);

            auth.password = bcrypt.hashSync(password, 10);

            await _Auth_Repository.update_auth({
                find: { _id: auth._id },
                update: auth,
                _em: f_em
            });

            f_em.flush();

            _Response = {
                ok: true,
                statusCode: 201,
                message: 'Contraseña actualizada',
                data: {
                    ...auth
                }
            }

        } catch (error) {

            this.logger.error(`[Accept password request] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.accept_passwordRequest`);

        }

        return _Response;

    }

}