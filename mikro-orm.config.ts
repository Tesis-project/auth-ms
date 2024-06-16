import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Migrator } from "@mikro-orm/migrations";
import { envs } from "./src/core/config/envs";

// console.log('process.env.DB_URL', process.env.DB_URL);

const config: Options = {
    entities: ["dist/**/*.entity{.ts,.js}"],
    entitiesTs: ['./src/**/*.entity{.ts,.js}'],

    driver: PostgreSqlDriver,

    clientUrl: process.env.DB_URL,
    debug: true,
    migrations: {
        path: 'dist/src/database/migrations',
        pathTs: './src/database/migrations',
    },
    extensions: [Migrator],

};

export default config;


