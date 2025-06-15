import express from "express";
import bodyParser from "body-parser";
import { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import { resolve } from "path";
import cookieparser from "cookie-parser";
import { register } from "./metrics/metrics";

const app = express();

app.use(bodyParser.json());
app.use(cookieparser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use("/api/auth", authRoutes);

// app.get('/metrics', async (_req, res) => {
//   res.set('Content-Type', register.contentType);
//   res.end(await register.metrics());
// });

dotenv.config();

app.listen(3002, () => {
  console.log("Server is running on port 3002");
});
