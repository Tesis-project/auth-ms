
import { Module } from '@nestjs/common';
import { MIKRO_ORM_MODULE_CONFIG } from './database/mikro-orm.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
    imports: [
        MIKRO_ORM_MODULE_CONFIG,
        UserModule,
        AuthModule
    ],
    controllers: [

    ],
    providers: [

    ],
})
export class AppModule { }