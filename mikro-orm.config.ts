import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Migrator } from "@mikro-orm/migrations";
import parseDbUrl from "./src/database/parseDbUrl";
// import { envs } from "./src/core/config/envs";

const dbConfig = parseDbUrl(process.env.DB_URL);


const config: Options = {
    entities: ["dist/**/*.entity{.ts,.js}"],
    entitiesTs: ['./src/**/*.entity{.ts,.js}'],

    driver: PostgreSqlDriver,
    dbName: dbConfig.dbName,
    user: dbConfig.user,
    password: dbConfig.password,
    host: dbConfig.host,
    port: dbConfig.port,

    debug: true,
    migrations: {
        path: 'dist/src/database/migrations',
        pathTs: './src/database/migrations',
    },
    extensions: [Migrator],

};

export default config;


