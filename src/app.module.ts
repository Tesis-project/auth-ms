
import { Module } from '@nestjs/common';
import { MIKRO_ORM_MODULE_CONFIG } from './database/mikro-orm.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
    imports: [
        MIKRO_ORM_MODULE_CONFIG,
        AuthModule
    ],
    controllers: [],
    providers: [
        
    ],
})
export class AppModule {  }
