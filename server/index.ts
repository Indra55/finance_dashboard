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

// ── Logging ──────────────────────────────────────────────────────
app.use(logger);

// ── Core middleware ──────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.CORS_ORIGIN || ["http://localhost:3000", "http://localhost:5173"],
  credentials: true,
}));

// ── Rate limiting ────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
app.use(limiter);

// ── Health check ─────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── API routes ───────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

// ── API Documentation (Swagger) ──────────────────────────────────
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.ts";
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customSiteTitle: "Zorvyn API Docs" }));

// ── 404 handler ──────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// ── Global error handler ─────────────────────────────────────────
app.use(errorHandler);

// ── Start server ─────────────────────────────────────────────────
if (import.meta.main) {
  app.listen(port, () => {
    console.log(`🚀 Zorvyn server running on port ${port}`);
  });
}

export default app;
