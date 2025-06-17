import http from "k6/http";
import { sleep, check } from "k6";
import { Counter } from "k6/metrics";

export const options = {
  stages: [
    { duration: "20s", target: 50 }, // Ramp up to 50 users
    { duration: "30s", target: 100 }, // Ramp up to 100 users
    { duration: "20s", target: 0 }, // Ramp down to 0 users
  ],
};

function getRandomInt() {
  return Math.floor(Math.random() * (1 - 98 + 1)) + 1;
}

const baseURL = "http://localhost:/api";

export default function () {
  const headers = {
    Cookie: `access_token=${__ENV.ACCESS_TOKEN}`,
  };

  // const getAllUsers = http.get(`${baseURL}/profile`, { headers });
  // check(getAllUsers, {
  //   "Get all users": (r) => r.status == 200,
  // });

  const getUserBefore = http.get(`${baseURL}/profile/r3PQzYkaQDgAUMMZfq6PQ2hhtAh2`, {
    headers,
  });
  const data = getUserBefore.json();

  check(getUserBefore, {
    "Get user (before edit)": (r) => r.status == 200,
    "Get user has correct id": () =>
      data.UserID === "r3PQzYkaQDgAUMMZfq6PQ2hhtAh2",
  });

  const randomAge = getRandomInt();
  const updateUser = http.put(
    `${baseURL}/profile/r3PQzYkaQDgAUMMZfq6PQ2hhtAh2`,
    JSON.stringify({
      id: "8d1960e8-280e-4cad-bad0-97a8d444ac65",
      firstName: "Timber",
      lastName: "Schreibing",
      age: randomAge,
      UserID: "r3PQzYkaQDgAUMMZfq6PQ2hhtAh2",
      Role: "student",
    }),
    {
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    }
  );
  const updateData = updateUser.json();

  check(updateUser, {
    "Update user status is 200": (r) => r.status == 200,
    "Update user age is correct": () => updateData.age === randomAge,
  });

  const getUserAfter = http.get(`${baseURL}/profile/r3PQzYkaQDgAUMMZfq6PQ2hhtAh2`, {
    headers,
  });
  const dataAfter = getUserAfter.json();

  check(getUserAfter, {
    "Get user (after edit)": (r) => r.status == 200,
    "Get user has correct id": () =>
      dataAfter.UserID === "r3PQzYkaQDgAUMMZfq6PQ2hhtAh2",
  });

  // const res = http.get(`${baseURL}/interaction`);
  // check(res, {
  //   success: (r) => r.status == 200,
  // });

  // sleep(1);
}
