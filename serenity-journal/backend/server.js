import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import quoteRoutes from "./routes/quoteRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import gratitudeRoutes from "./routes/gratitudeRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/gratitude", gratitudeRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serenity Journal API running on port ${PORT}`));
