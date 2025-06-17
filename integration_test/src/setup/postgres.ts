import {
  GenericContainer,
  StartedTestContainer,
  Wait,
  Network,
} from "testcontainers";
import * as dotenv from "dotenv";
import { Client } from "pg";
import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";

dotenv.config();

let container: StartedPostgreSqlContainer, client: Client;

export const startPostgres = async (image: string, networkName: string) => {
  container = await new PostgreSqlContainer(image)
    .withEnvironment(dotenv.config().parsed ?? {})
    .withDatabase(process.env.POSTGRES_DB || "FairwayFriends1")
    .withUsername(process.env.POSTGRES_USER || "admin2")
    .withPassword(process.env.POSTGRES_PASSWORD || "admin2")
    .withNetworkAliases("postgres")
    .withExposedPorts(5432)
    .withNetworkMode(networkName)
    .start();

  console.log(
    `Postgres started on ${container.getHost()}:${container.getMappedPort(
      5432
    )}`
  );

  client = new Client({
    connectionString: container.getConnectionUri()
  });

  await client.connect();

  return { container, client };
};

export const stopPostgres = async () => {
  await client?.end();
  await container?.stop();
};
