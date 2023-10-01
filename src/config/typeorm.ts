import { registerAs } from "@nestjs/config";
import { config as dotenvConfig } from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";

dotenvConfig({ path: ".env." + (process.env.NODE_ENV || "local") });
let entities = [__dirname + "/../entities/*.entity{.ts,.js}"];
let migrations = [__dirname + "/../migrations/*{.ts,.js}"];

const config = {
  entities,
  synchronize: true, // NOTE: NEVER USE THIS
  autoLoadEntities: true, // TODO: remove this on production
  // migrations,
  // keepConnectionAlive: !this.isTest,
  // dropSchema: this.isTest,
  ssl: process.env.DB_SSL,
  type: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // migrationsRun: true,
  migrations: migrations,
  logging: process.env.ENABLE_ORM_LOGS === "true",
  maxQueryExecutionTime: -1,
  cache: true,
};

export default registerAs("typeorm", () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
