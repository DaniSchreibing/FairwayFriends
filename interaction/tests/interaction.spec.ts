import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Interaction from "../src/models/interaction.model";
import {
  createInteraction,
  getInteractions,
  getInteractionByUserID,
  deleteInteraction,
  deleteByUserID,
} from "../src/services/interaction.service";

let mongod: MongoMemoryServer;
let uri: string;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  uri = await mongod.getUri();
});

beforeAll(async () => {
  await mongoose.connect(uri);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe("Interaction Service", () => {
  describe("createInteraction", () => {
    it("should successfully create a new interaction", async () => {
      const testData = {
        userID: "test-user-id",
        type: "click",
        timestamp: new Date(),
        name: "Test Interaction",
        comment: "Test comment",
      };

      const result = await createInteraction(testData);
      expect(result).toHaveProperty("_id");
      expect(result.userID).toBe(testData.userID);
      expect(result.type).toBe(testData.type);
      expect(result.name).toBe(testData.name);
      expect(result.comment).toBe(testData.comment);
    });

    it("should throw error with invalid data", async () => {
      const testData = {} as any;

      await expect(createInteraction(testData)).rejects.toThrow(
        "Error creating interaction"
      );
    });
  });

  describe("getInteractions", () => {
    let createdInteraction: any;

    beforeEach(async () => {
      // Create test interactions
      createdInteraction = await createInteraction({
        userID: "test-user-1",
        type: "click",
        timestamp: new Date(),
        name: "Test Interaction 1",
        comment: "Test comment 1",
      });
      await createInteraction({
        userID: "test-user-2",
        type: "hover",
        timestamp: new Date(),
        name: "Test Interaction 2",
        comment: "Test comment 2",
      });
    });

    it("should return all interactions", async () => {
      const interactions = await getInteractions();
      expect(interactions).toHaveLength(2);
      expect(Array.isArray(interactions)).toBeTruthy();
    });

    it("should return empty array when no interactions exist", async () => {
      await Interaction.deleteMany({});
      const interactions = await getInteractions();
      expect(interactions).toEqual([]);
    });

    it("should throw general errors", async () => {
      jest
        .spyOn(Interaction, "findByIdAndDelete")
        .mockRejectedValueOnce(new Error("MongoDB connection timeout"));

      await expect(deleteInteraction(createdInteraction._id)).rejects.toThrow(
        expect.objectContaining({
          message: expect.stringMatching(/^Error deleting interaction: .+$/),
        })
      );
    });
  });

  describe("getInteractionByUserID", () => {
    beforeEach(async () => {
      await createInteraction({
        userID: "test-user-id",
        type: "click",
        timestamp: new Date(),
        name: "Test Interaction",
        comment: "Test comment",
      });
    });

    it("should return interactions for valid user ID", async () => {
      const interactions = await getInteractionByUserID("test-user-id");
      expect(Array.isArray(interactions)).toBeTruthy();
      expect(interactions.length).toBeGreaterThan(0);
      expect(interactions[0].userID).toBe("test-user-id");
      expect(interactions[0].name).toBeDefined();
      expect(interactions[0].comment).toBeDefined();
    });

    it("should throw error for non-existent user ID", async () => {
      const testData = {} as any;

      await expect(getInteractionByUserID(testData)).rejects.toThrow(
        "Error getting interaction"
      );
    });
  });

  describe("deleteInteraction", () => {
    let createdInteraction: any;

    beforeEach(async () => {
      createdInteraction = await createInteraction({
        userID: "test-user-id",
        type: "click",
        timestamp: new Date(),
        name: "Test Interaction",
        comment: "Test comment",
      });
    });

    it("should delete interaction by valid ID", async () => {
      const deleted = (await deleteInteraction(createdInteraction._id)) as {
        _id: mongoose.Types.ObjectId;
      };
      expect(deleted).toBeDefined();
      expect(deleted._id.toString()).toBe(createdInteraction._id.toString());

      // Verify deletion
      const remainingInteractions = await getInteractions();
      expect(remainingInteractions.length).toBe(0);
    });

    it("should throw error for invalid ID", async () => {
      const testData = {} as any;

      await expect(getInteractionByUserID(testData)).rejects.toThrow(
        "Error getting interaction"
      );
    });

    it("should throw general errors", async () => {
      jest
        .spyOn(Interaction, "findByIdAndDelete")
        .mockRejectedValueOnce(new Error("MongoDB connection timeout"));

      await expect(deleteInteraction(createdInteraction._id)).rejects.toThrow(
        expect.objectContaining({
          message: expect.stringMatching(/^Error deleting interaction: .+$/),
        })
      );
    });
  });

  describe("deleteByUserID", () => {
    let createdInteraction: any;

    beforeEach(async () => {
      createdInteraction = await createInteraction({
        userID: "test-user-id",
        type: "click",
        timestamp: new Date(),
        name: "Test Interaction",
        comment: "Test comment",
      });
    });

    it("should delete interaction by valid user ID", async () => {
      const deleted = await deleteByUserID("test-user-id");
      expect(deleted).toBeDefined();

      // Verify deletion
      const remainingInteractions = await getInteractions();
      expect(remainingInteractions.length).toBe(0);
    });

    it("should throw error for invalid ID", async () => {
      const testData = {} as any;

      await expect(getInteractionByUserID(testData)).rejects.toThrow(
        "Error getting interaction"
      );
    });

    it("should throw general errors", async () => {
      jest
        .spyOn(Interaction, "findByIdAndDelete")
        .mockRejectedValueOnce(new Error("MongoDB connection timeout"));

      await expect(deleteInteraction(createdInteraction._id)).rejects.toThrow(
        expect.objectContaining({
          message: expect.stringMatching(/^Error deleting interaction: .+$/),
        })
      );
    });
  });
});
