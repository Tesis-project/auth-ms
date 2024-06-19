/*
https://docs.nestjs.com/modules
*/

import { Global, Module } from '@nestjs/common';
import { UserService_GW } from './user.service';
import { NatsModule } from '../../core/transports/nats.module';

@Global()
@Module({
    imports: [
        NatsModule
    ],
    controllers: [],
    providers: [
        UserService_GW
    ],
    exports: [
        UserService_GW
    ]
})
export class UserModule {}

