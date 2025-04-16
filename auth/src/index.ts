import express from "express";
import bodyParser from "body-parser";
import { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import { resolve } from "path";
import cookieparser from "cookie-parser";

const app = express();
app.use(bodyParser.json());
app.use(cookieparser());
app.use(cors());

app.use("/api/auth", authRoutes);

dotenv.config();

app.listen(3002, () => {
  console.log("Server is running on port 3002");
});
