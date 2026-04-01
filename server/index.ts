import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoute.ts";
import recordRoutes from "./routes/recordRoute.ts";
import dashboardRoutes from "./routes/dashboardRoute.ts";
import userRoutes from "./routes/userRoute.ts";
import { errorHandler } from "./middleware/errorHandler.ts";
import { logger } from "./middleware/logger.ts";

const app = express();
const port = process.env.PORT || 5555;

app.use(logger);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000", "http://localhost:5173"],
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
app.use(limiter);

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.ts";
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customSiteTitle: "Zorvyn API Docs" }));

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found." });
});

app.use(errorHandler);

if (import.meta.main) {
  app.listen(port, () => {
    console.log(`🚀 Zorvyn server running on port ${port}`);
  });
}

export default app;
