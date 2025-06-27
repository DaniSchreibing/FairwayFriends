import { GenericContainer, StartedTestContainer, Wait } from "testcontainers";
import amqp from "amqplib";
import { RabbitMQConfig } from "./rabbitMQ.config";

let container: StartedTestContainer;
let connection: amqp.ChannelModel;
let channel: amqp.Channel;

export const startRabbit = async (
  networkName: string
): Promise<RabbitMQConfig> => {
  container = await new GenericContainer("rabbitmq:3-management")
    .withExposedPorts(5672)
    .withNetworkMode(networkName)
    .withNetworkAliases("rabbitmq")
    .withEnvironment({
      RABBITMQ_DEFAULT_USER: "guest",
      RABBITMQ_DEFAULT_PASS: "guest",
    })
    .withWaitStrategy(Wait.forLogMessage("Server startup complete"))
    .start();

  const uri = `amqp://guest:guest@${container.getHost()}:${container.getMappedPort(
    5672
  )}`;
  connection = await amqp.connect(uri);
  channel = await connection.createChannel();

  return { uri, connection, channel, container };
};

export const stopRabbit = async () => {
  await channel?.close();
  await connection?.close();
  await container?.stop();
};
