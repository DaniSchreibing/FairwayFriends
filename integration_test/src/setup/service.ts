import {
  GenericContainer,
  StartedTestContainer,
  Wait,
  Network,
} from "testcontainers";
import * as dotenv from "dotenv";

dotenv.config();

let service: StartedTestContainer;

const requiredEnvKeys = [
  "AMQP_URL",
  "POSTGRES_USERNAME",
  "POSTGRES_PASSWORD",
  "POSTGRES_DB",
  "POSTGRES_HOST",
  "POSTGRES_PORT",
  "FIREBASE_API_KEY",
  "FIREBASE_AUTH_DOMAIN",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_STORAGE_BUCKET",
  "FIREBASE_MESSAGING_SENDER_ID",
  "FIREBASE_APP_ID",
  "FIREBASE_PRIVATE_KEY",
  "FIREBASE_CLIENT_EMAIL",
  "ACCESS_TOKEN",
];

// Build environment object from process.env
const buildContainerEnv = (): Record<string, string> => {
  return requiredEnvKeys.reduce((envs, key) => {
    const value = process.env[key];
    if (!value) {
      console.warn(`⚠️  Environment variable "${key}" is not set.`);
    } else {
      envs[key] = value;
    }
    return envs;
  }, {} as Record<string, string>);
};

export const startService = async (
  image: string,
  port: number,
  networkName: string
): Promise<StartedTestContainer> => {
  const containerEnv = buildContainerEnv();

  service = await new GenericContainer(image)
    .withExposedPorts(port)
    .withNetworkMode(networkName)
    .withEnvironment(containerEnv)
    .start();

  console.log(
    `Service started on ${service.getHost()}:${service.getMappedPort(port)}`
  );

  return service;
};

export const stopService = async () => {
  await service?.stop();
};
