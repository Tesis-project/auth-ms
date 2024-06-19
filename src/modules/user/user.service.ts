/*
https://docs.nestjs.com/providers#services
*/

import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from '../../core/config/services';
import { CreateUserDto } from './dto/create-user.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService_GW {

    constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy
    ) {

    }

    async create_user(user: CreateUserDto) {

        const resp = await firstValueFrom(
            this.client.send('user.create', user)
        )

        console.log('la resp', resp);
        return resp

    }

}
