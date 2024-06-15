import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Auth_Ety } from './entities/auth.entity';
import { JwtModule } from '@nestjs/jwt';
import { envs } from '../../core/config/envs';
import { AuthRepositoryService } from './entities';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, AuthRepositoryService],
    exports: [
        JwtStrategy, PassportModule
    ],
    imports: [
        PassportModule.register({
            defaultStrategy: 'jwt',
        }),
        JwtModule.registerAsync({

            useFactory() {
                return {
                    secret: envs.jwtSecret,
                    signOptions: {
                        expiresIn: '48H',
                    },
                };
            },
        }),

        MikroOrmModule.forFeature([
            Auth_Ety
        ]),
    ]
})
export class AuthModule { }
