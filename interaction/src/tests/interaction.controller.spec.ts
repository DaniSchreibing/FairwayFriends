import request from "supertest"; // ✅ Use default import
import express from "express";
import * as interactionController from "../controllers/interaction.controller";
import * as interactionService from "../services/interaction.service";

jest.mock("../services/interaction.service");

const app = express();
app.use(express.json());
app.post("/interaction", interactionController.createInteraction);
app.get("/interactions", interactionController.getInteractions);

describe("Interaction Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create an interaction and return 201", async () => {
    const mockInteraction = { id: "1", message: "Hello" };
    (interactionService.createInteraction as jest.Mock).mockResolvedValue(mockInteraction);

    const response = await request(app).post("/interaction").send({ message: "Hello" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockInteraction);
  });

  it("should return 500 on service error", async () => {
    (interactionService.createInteraction as jest.Mock).mockRejectedValue(new Error("Database error"));

    const response = await request(app).post("/interaction").send({ message: "Test" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Database error" });
  });
});
