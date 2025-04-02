import * as interactionService from "../services/interaction.service";
import Interaction from "../models/interaction.model";
import { Model } from "mongoose";

jest.mock("../models/interaction.model");

describe("Interaction Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create an interaction", async () => {
    const mockInteraction = { message: "Hello", save: jest.fn().mockResolvedValue(undefined) };
    jest.spyOn(Interaction.prototype, "save").mockImplementation(mockInteraction.save);

    const result = await interactionService.createInteraction({ message: "Hello" });

    expect(mockInteraction.save).toHaveBeenCalled();
    expect(result).toEqual(expect.objectContaining({ message: "Hello" }));
  });

  it("should throw an error if interaction creation fails", async () => {
    jest.spyOn(Interaction.prototype, "save").mockRejectedValue(new Error("DB error"));

    await expect(interactionService.createInteraction({ message: "Hello" }))
      .rejects.toThrow("Error creating interaction: DB error");
  });
});
