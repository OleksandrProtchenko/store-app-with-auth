import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";

import authRoutes from "./src/routes/auth.routes.js";
import ordersRoutes from "./src/routes/orders.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

await connectDB();

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/orders", ordersRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
