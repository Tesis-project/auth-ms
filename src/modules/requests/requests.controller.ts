import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Create_Password_Request_Dto, Create_Request_Key_Dto, Accept_Password_Request_Dto, Auth_User_I_Dto } from '@tesis-project/dev-globals/dist/modules/auth/dto';
import { RequestsService } from './services';


@Controller()
export class RequestsController {

    constructor(private readonly requestsService: RequestsService) { }

    @MessagePattern('auth.requests.pass_request')
    create_password_request(@Payload() create_request_dto: Create_Password_Request_Dto) {

        return this.requestsService.create_password_request(create_request_dto);

    }

    @MessagePattern('auth.requests.create')
    create_request(
        @Payload('data') create_request_dto: Create_Request_Key_Dto,
        @Payload('user_auth') user_auth: Auth_User_I_Dto,
    ) {

        return this.requestsService.create_request(create_request_dto, user_auth);

    }

    @MessagePattern('auth.requests.get')
    get_request(@Payload('key') key: string) {

        return this.requestsService.get_request(key);

    }

    @MessagePattern('auth.requests.verify')
    verify_request(@Payload('key') key: string) {

        return this.requestsService.verify_request(key);

    }

    @MessagePattern('auth.requests.verify_pass')
    verify_pass_request(
        @Payload('key') key: string,
        @Payload('data') Accept_Password_Request_Dto: Accept_Password_Request_Dto
    ) {

        return this.requestsService.verify_pass_request(key, Accept_Password_Request_Dto);

    }

}
