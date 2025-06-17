import { GenericContainer, StartedTestContainer, Wait, Network } from "testcontainers";

let service: StartedTestContainer;

export const startService = async (
  image: string,
  port: number,
  networkName: string
): Promise<StartedTestContainer> => {
  service = await new GenericContainer(image)
    .withExposedPorts(port)
    .withNetworkMode(networkName)
    .withEnvironment({
      MONGODB_URI:
        "mongodb://root:example@mongo:27017/recruitflow?authSource=admin",
      RABBITMQ_URL: "amqp://guest:guest@rabbitmq:5672",
    })
    .withWaitStrategy(Wait.forHttp("/api/health", port))
    .start();

    console.log(`Service started on ${service.getHost()}:${service.getMappedPort(port)}`);

  return service;
};

export const stopService = async () => {
  await service?.stop();
};