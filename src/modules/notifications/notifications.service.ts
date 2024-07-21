
import { Injectable, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { NATS_SERVICE } from "../../core/config/services";
import { Create_Notification_Dto } from '@tesis-project/dev-globals/dist/modules/notifications/dto';
import { Notifications_Ety } from '../../../../notifications-ms/src/modules/notifications/entities/notification.entity';
import { _Response_I } from "@tesis-project/dev-globals/dist/core/interfaces";
import { firstValueFrom } from "rxjs";


@Injectable()
export class Notifications_Service_GW{

    constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy
    ) {

    }

    async create_notification( createNotificationDto: Create_Notification_Dto): Promise<_Response_I<Notifications_Ety>> {

        const resp = await firstValueFrom(
            this.client.send('notifications.create', createNotificationDto)
        )
        return resp

    }


}
