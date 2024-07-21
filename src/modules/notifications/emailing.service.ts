import { Injectable, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { NATS_SERVICE } from "../../core/config/services";
import { _Response_I } from "@tesis-project/dev-globals/dist/core/interfaces";
import { Send_Email_Dto } from '@tesis-project/dev-globals/dist/modules/notifications/dto/send-email.dto';
import { firstValueFrom } from "rxjs";


@Injectable()
export class Notifications_Emailing_Service_GW {

    constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy
    ) {

    }

    async send_email(send_email_dto: Send_Email_Dto): Promise<_Response_I> {

        const resp = await firstValueFrom(
            this.client.emit('notifications.emailing.send', send_email_dto)
        )
        return resp

    }


}