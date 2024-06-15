import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { envs } from "./src/core/config/envs";
import { Migrator } from "@mikro-orm/migrations";
import parseDbUrl from "./src/database/parseDbUrl";

const dbConfig = parseDbUrl(envs.db_url);



const config: Options = {
    entities: ["dist/**/*.entity{.ts,.js}"],
    entitiesTs: ['./src/**/*.entity{.ts,.js}'],

    driver: PostgreSqlDriver,
    dbName: dbConfig.dbName,
    user: dbConfig.user,
    password: dbConfig.password,
    host: dbConfig.host,
    port: dbConfig.port,

    // clientUrl: envs.db_url,
    debug: true,
    migrations: {
        path: 'dist/src/database/migrations',
        pathTs: './src/database/migrations',
    },
    extensions: [Migrator],

};

export default config;



