import axios from "axios";
import { randomUUID } from "crypto";

let access_token: string;
let uid: string;
let interaction: any;

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:";
const interactionPath = `${BASE_URL}/api/interaction`;
const authPath = `${BASE_URL}/api/auth`;
const profilePath = `${BASE_URL}/api/profile`;

function generateUUID(): string {
  return randomUUID();
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe("E2E Tests", () => {
  console.log("Waiting for the server to start...");
  //add sleep here
  beforeAll(async () => {
    await sleep(20000); // Wait for 5 seconds to ensure the server is up
    console.log("Starting E2E tests...");
  });

  const userId = generateUUID();

  it("should register a user", async () => {
    const registerResponse = await axios.post(`${authPath}/register`, {
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
    });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.data.message).toBe(
      "Verification email sent! User created successfully!"
    );
  });

  it("should login the new user", async () => {
    const loginResponse = await axios.post(`${authPath}/login`, {
      email: `test_${userId}@gmail.com`,
      password: "test123",
    });

    const res = loginResponse.data;

    expect(loginResponse.status).toBe(200);
    expect(res).toHaveProperty("userCredential");
    expect(res.userCredential.user.stsTokenManager).toHaveProperty(
      "accessToken"
    );
    expect(res.userCredential.user).toHaveProperty("uid");

    access_token = res.userCredential.user.stsTokenManager.accessToken;
    uid = res.userCredential.user.uid;
  });

  it("should get the user profile", async () => {
    const profileResponse = await axios.get(`${profilePath}/${uid}`, {
      headers: { Cookie: `access_token=${access_token}; path=/;` },
    });

    expect(profileResponse.status).toBe(200);
    expect(profileResponse.data).toHaveProperty("firstName", "Integration");
    expect(profileResponse.data).toHaveProperty("UserID", uid);
  });

  it("should update the user profile", async () => {
    const updateProfileResponse = await axios.put(
      `${profilePath}/${uid}`,
      {
        firstName: "Updated",
        lastName: "Test",
        age: 30,
        Role: "student",
      },
      {
        headers: { Cookie: `access_token=${access_token}; path=/;` },
      }
    );
    expect(updateProfileResponse.status).toBe(200);
    expect(updateProfileResponse.data).toHaveProperty("firstName", "Updated");
    expect(updateProfileResponse.data).toHaveProperty("age", 30);
  });

  it("should create an interaction", async () => {
    const interactionData = await axios.post(
      `${interactionPath}`,
      {
        type: "comment",
        userID: uid,
        comment: "You should focus on keeping your right arm straight!",
        name: "Dani Schreibing",
      },
      {
        headers: { Cookie: `access_token=${access_token}; path=/;` },
      }
    );
    expect(interactionData.status).toBe(201);
    expect(interactionData.data).toHaveProperty("type", "comment");
    expect(interactionData.data).toHaveProperty("userID", uid);
    expect(interactionData.data).toHaveProperty(
      "comment",
      "You should focus on keeping your right arm straight!"
    );
    expect(interactionData.data).toHaveProperty("name", "Dani Schreibing");

    interaction = interactionData.data;
  });

  it("should get the user' interactions", async () => {
    const interactionsResponse = await axios.get(
      `${interactionPath}/${uid}`,
      {
        headers: { Cookie: `access_token=${access_token}; path=/;` },
      }
    );

    expect(interactionsResponse.status).toBe(200);
    expect(interactionsResponse.data[0]).toHaveProperty("userID", uid);
    expect(interactionsResponse.data[0]).toHaveProperty("objectID", interaction.objectID);
    expect(interactionsResponse.data[0]).toHaveProperty("type", interaction.type);
    expect(Array.isArray(interactionsResponse.data)).toBe(true);
  });

  it("should delete the user", async () => {
    const deleteUserResponse = await axios.post(
      `${authPath}/delete-user`,
      {},
      {
        headers: { Cookie: `access_token=${access_token}; path=/;` },
      }
    );

    expect(deleteUserResponse.status).toBe(200);
  });
});
