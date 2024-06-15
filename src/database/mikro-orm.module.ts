import { MikroOrmModule } from "@mikro-orm/nestjs";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { envs } from "../core/config/envs";
import config from "../../mikro-orm.config";


export const MIKRO_ORM_MODULE_CONFIG = MikroOrmModule.forRoot(config);

