
import { Module } from '@nestjs/common';
import { MIKRO_ORM_MODULE_CONFIG } from './database/mikro-orm.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RequestsModule } from './modules/requests/requests.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
    imports: [
        MIKRO_ORM_MODULE_CONFIG,
        UserModule,
        NotificationsModule,
        AuthModule,
        RequestsModule
    ],
    controllers: [

    ],
    providers: [

    ],
})
export class AppModule { }