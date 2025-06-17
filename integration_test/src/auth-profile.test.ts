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

dotenv.config();

let aut_service: StartedTestContainer,
  profile_service: StartedTestContainer,
  postgres_client: Client,
  network;

const accessToken = process.env.ACCESS_TOKEN;

beforeAll(async () => {
  console.log("Starting services...");

  network = await new Network().start();
  console.log("Network started:", network.getName());

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
  await stopService();
  await stopPostgres();
});

test("Login and get profile", async () => {
  const loginResponse = await supertest(
    `http://${aut_service.getHost()}:${aut_service.getMappedPort(3002)}`
  )
    .post("/api/auth/login")
    .send({
      email: "test@gmail.com",
      password: "test123",
    })
    .set("Content-Type", "application/json");

  expect(loginResponse.status).toBe(200);
  const loginData = await loginResponse.body;
  const token = loginData.userCredential.user.stsTokenManager.accessToken;
  console.log("Access Token:", token);
  expect(loginData).toHaveProperty("userCredential");

  const profileRes = await supertest(
    `http://${profile_service.getHost()}:${profile_service.getMappedPort(3003)}`
  )
    .get("/api/profile/r3PQzYkaQDgAUMMZfq6PQ2hhtAh2")
    .set("Cookie", [`access_token=${token};`, "path=/;"]);

  expect(profileRes.status).toBe(200);
  const profileData = await profileRes.body;
  expect(profileData).toHaveProperty("UserID", "r3PQzYkaQDgAUMMZfq6PQ2hhtAh2");
  expect(profileData).toHaveProperty(
    "id",
    "8d1960e8-280e-4cad-bad0-97a8d444ac65"
  );
});
