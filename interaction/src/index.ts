import express from "express";
import bodyParser from "body-parser";
import { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import interactionRoutes from "./routes/interaction.route";
import { connectDB } from "./db";
import Interaction from "./models/interaction.model";

// create express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// setup routes
app.use("/api/users", interactionRoutes);

dotenv.config();

// get mongo env variables
// const mongoUri =
//   "mongodb+srv://admin:admin@fairwayfriends.bfthz6f.mongodb.net/?retryWrites=true&w=majority&appName=FairwayFriends";
// const clientOptions = {
//   serverApi: { version: "1" as const, strict: true, deprecationErrors: true },
// };

// mongoose
//   .connect(mongoUri, clientOptions)
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((err) => {
//     console.error("Error connecting to MongoDB", err);
//   });

const addInitialRecord = async () => {
  try {
    const existingRecord = await Interaction.findOne({ name: "AutoRecord" });
    if (!existingRecord) {
      const newRecord = new Interaction({
        name: "AutoRecord",
        type: "auto",
        userID: "system",
        comment: "This is an automatic record.",
      });
      await newRecord.save();
      console.log("Automatic record added:", newRecord);
    } else {
      console.log("Record already exists.");
    }
    const record = await Interaction.findOne({ name: "userTest" });
    if (!record) {
      const newRecord = new Interaction({
        name: "userTest",
        type: "user",
        userID: "0eaf6527-ae7e-41fa-afc7-7491f11dedbd",
        comment: "This is a test record.",
      });
      await newRecord.save();
      console.log("Test record added:", newRecord);
    } else {
      console.log("Record already exists.");
    }
  } catch (error) {
    console.error("Error adding automatic record:", error);
  }
};

connectDB().then(() => {
  console.log("Connected to MongoDB");
  addInitialRecord();
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
