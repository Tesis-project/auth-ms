import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './core/config/envs';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

    const logger = new Logger('Auth-ms - Main')

     const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.NATS,
            options: {
                servers: envs.natsServers
            }
        }
    );

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true
        })
    );
    await app.listen();
    logger.log(`Microservice is running`);

    //     const logger = new Logger('Auth - ms - Main')

    // const app = await NestFactory.create(AppModule);

    // app.setGlobalPrefix('api');

    // app.useGlobalPipes(
    //     new ValidationPipe({
    //         whitelist: true,
    //         forbidNonWhitelisted: true
    //     })
    // )

    // await app.listen(envs.port);

    // logger.log(`Server is running on ${await app.getUrl()}`);

}
bootstrap();


