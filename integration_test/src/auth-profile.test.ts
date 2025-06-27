import {
  GenericContainer,
  StartedTestContainer,
  Wait,
  Network,
} from "testcontainers";
import { startService, stopService } from "./setup/service";
import supertest from "supertest";
import { Client } from "pg";
import { startPostgres, stopPostgres } from "./setup/postgres";
import * as dotenv from "dotenv";
import { randomUUID } from "crypto";
import { RabbitMQConfig } from "./setup/rabbitMQ.config";
import { startRabbit, stopRabbit } from "./setup/rabbitMQ";

dotenv.config();

let aut_service: StartedTestContainer,
  profile_service: StartedTestContainer,
  postgres_client: Client,
  rabbitMQ: RabbitMQConfig,
  network;

const accessToken = process.env.ACCESS_TOKEN;

beforeAll(async () => {
  console.log("Starting services...");

  network = await new Network().start();
  console.log("Network started:", network.getName());

  rabbitMQ = await startRabbit(network.getName());
  console.log("RabbitMQ started:", rabbitMQ.container.getId());
  console.log("RabbitMQ URL:", process.env.AMQP_URL);

  aut_service = await startService(
    "367074/auth:latest",
    3002,
    network.getName()
  );

  const postgres = await startPostgres("postgres:14.5", network.getName());
  console.log("Postgres started:", postgres.container.getId());

  postgres_client = postgres.client;
  console.log("Postgres client connected");

  profile_service = await startService(
    "367074/profile",
    3003,
    network.getName()
  );
}, 240_000);

afterAll(async () => {
  await stopRabbit();
  await stopService();
  await stopPostgres();
});

test("Login and get profile", async () => {
  const userId = generateUUID();
  console.log("Generated User ID:", userId);

  const authPort = aut_service.getMappedPort(3002);
  const profilePort = profile_service.getMappedPort(3003);
  const authHost = aut_service.getHost();
  const profileHost = profile_service.getHost();
  
  const registerResponse = await supertest(
    `http://${authHost}:${authPort}`
  )
    .post("/api/auth/register")
    .send({
      registerData: {
        email: `test_${userId}@gmail.com`,
        password: "test123",
      },
      profileData: {
        firstName: "Integration",
        lastName: "Test",
        age: 28,
        Role: "student",
      },
    })
    .set("Content-Type", "application/json");

  console.log("Register Response:", registerResponse.body);
  expect(registerResponse.status).toBe(201);
  console.log("User registered successfully");

  await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds to ensure the user is created

  const loginResponse = await supertest(
    `http://${authHost}:${authPort}`
  )
    .post("/api/auth/login")
    .send({
      email: `test_${userId}@gmail.com`,
      password: "test123",
    })
    .set("Content-Type", "application/json");

  expect(loginResponse.status).toBe(200);
  const loginData = await loginResponse.body;
  const token = loginData.userCredential.user.stsTokenManager.accessToken;
  const uid = loginData.userCredential.user.uid;
  console.log("Access Token:", token);
  expect(loginData).toHaveProperty("userCredential");

  const profileRes = await supertest(
    `http://${profileHost}:${profilePort}`
  )
    .get(`/api/profile/${uid}`)
    .set("Cookie", [`access_token=${token};`, "path=/;"]);

  expect(profileRes.status).toBe(200);
  const profileData = await profileRes.body;
  expect(profileData).toHaveProperty("UserID", uid);

  const deleteUserResponse = await supertest(
    `http://${authHost}:${authPort}`)
    .post("/api/auth/delete-user")
    .set("Cookie", [`access_token=${token};`, "path=/;"]);
  
  expect(deleteUserResponse.status).toBe(200);
  console.log("User deleted successfully");
});

function generateUUID(): string {
  return randomUUID();
}