import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config();

const mongoUri = process.env.MONGO_URI;

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoUri as string);
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
