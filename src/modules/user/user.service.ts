/*
https://docs.nestjs.com/providers#services
*/

import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from '../../core/config/services';
import { firstValueFrom } from 'rxjs';

import { CreateUser_Dto } from '@tesis-project/dev-globals/dist/modules/user/dto';
import { User_I } from '@tesis-project/dev-globals/dist/modules/user/interfaces';
import { _Response_I } from '@tesis-project/dev-globals/dist/interfaces';

@Injectable()
export class UserService_GW {

    constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy
    ) {

    }

    async create_user(user: CreateUser_Dto): Promise<_Response_I<User_I>> {

        const resp = await firstValueFrom(
            this.client.send('user.create', user)
        )
        return resp

    }

}
