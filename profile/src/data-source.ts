import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(__dirname, "../.env") });

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "postgres",
  port: 5432,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  logging: false,
  entities: ["src/entity/*.ts"],
  migrations: ['src/migration/*-TestMigration.ts'],
  migrationsRun: false,
  subscribers: [],
});
