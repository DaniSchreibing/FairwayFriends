import {
  GenericContainer,
  StartedTestContainer,
  Wait,
  Network,
} from "testcontainers";
import { startService, stopService } from "./setup/service";
import supertest from "supertest";

let aut_service: StartedTestContainer,
  profile_service: StartedTestContainer,
  network;

beforeAll(async () => {
  console.log("Starting services...");

  network = await new Network().start();
  console.log("Network started:", network.getName());
  
  aut_service = await startService(
    "367074/auth:latest",
    3002,
    network.getName()
  );
  //   profile_service = await startService("367074/profile", 3003);
}, 240_000);

afterAll(async () => {
  await stopService();
});

test("Login and get profile", async () => {
  const loginResponse = await supertest(
    `http://${aut_service.getHost()}:${aut_service.getMappedPort(3002)}`
  )
    .post("/login")
    .send({
      email: "test@gmail.com",
      password: "test123",
    })
    .set("Content-Type", "application/json");

  expect(loginResponse.status).toBe(200);
  const loginData = await loginResponse.body.json();
  expect(loginData).toHaveProperty("userCredential");

  //   const profileRes = await supertest(`http://${profile_service.getHost()}:${profile_service.getMappedPort(3003)}`)
  //     .get("/profile/r3PQzYkaQDgAUMMZfq6PQ2hhtAh2")

  //   expect(profileRes.status).toBe(200);
  //   const profileData = await profileRes.body.json();
  //   expect(profileData).toHaveProperty("UserID", "r3PQzYkaQDgAUMMZfq6PQ2hhtAh2");
  //   expect(profileData).toHaveProperty("id", "8d1960e8-280e-4cad-bad0-97a8d444ac65");
});
