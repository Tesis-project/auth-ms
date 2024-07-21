import { Module } from '@nestjs/common';
import { RequestsController } from './requests.controller';
import { Requests_Repository } from './entities/requests.repository.service';
import { Requests_Ety } from './entities/requests.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Requests_Auth_Service, RequestsService } from './services';

@Module({
    controllers: [RequestsController],
    providers: [RequestsService, Requests_Auth_Service, Requests_Repository],
    imports: [
        MikroOrmModule.forFeature([
            Requests_Ety
        ]),
    ],
    exports: [
        RequestsService
    ]
})
export class RequestsModule { }
