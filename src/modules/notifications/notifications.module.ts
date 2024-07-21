

import { Global, Module } from "@nestjs/common";
import { NatsModule } from "../../core/transports/nats.module";
import { Notifications_Service_GW } from "./notifications.service";
import { Notifications_Emailing_Service_GW } from "./emailing.service";


@Global()
@Module({
    imports: [
        NatsModule
    ],
    providers: [
        Notifications_Service_GW,
        Notifications_Emailing_Service_GW
    ],
    exports: [
        Notifications_Service_GW,
        Notifications_Emailing_Service_GW
    ]
})
export class NotificationsModule {}

