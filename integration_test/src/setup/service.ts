import {
  GenericContainer,
  StartedTestContainer,
  Wait,
  Network,
} from "testcontainers";
import * as dotenv from "dotenv";

dotenv.config();

let service: StartedTestContainer;

export const startService = async (
  image: string,
  port: number,
  networkName: string
): Promise<StartedTestContainer> => {
  service = await new GenericContainer(image)
    .withExposedPorts(port)
    .withNetworkMode(networkName)
    .withEnvironment(dotenv.config().parsed ?? {})
    .start();

  console.log(
    `Service started on ${service.getHost()}:${service.getMappedPort(port)}`
  );

  return service;
};

export const stopService = async () => {
  await service?.stop();
};
