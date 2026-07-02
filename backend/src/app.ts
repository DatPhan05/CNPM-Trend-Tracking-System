import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { apiLimiter } from "./middlewares/rateLimit.middleware";
import { securityHeaders } from "./middlewares/security.middleware";
import { cacheMiddleware } from "./middlewares/cache.middleware";

import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import userRoutes from "./routes/user.routes";
import settingRoutes from "./routes/setting.routes";
import crawlerRoutes from "./routes/crawler.routes";
import paperRoutes from "./routes/paper.routes";
import bookmarkRoutes from "./routes/bookmark.routes";
import analyticsRoutes from "./routes/analytics.routes";
import { getTrends } from "./controllers/paper.controller";
import prisma from "./helpers/prisma";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// Security middleware
app.use(securityHeaders);

// Rate limiting for API routes
app.use('/api/', apiLimiter);

// Cache middleware for specific endpoints
app.use('/api/papers', cacheMiddleware(300)); // Cache paper listings for 5 minutes
app.use('/api/trends', cacheMiddleware(60));  // Cache trends for 1 minute

// ── RESTful Constraint #3: Cacheability ──────────────────────────────────────
app.use((req, res, next) => {
  if (req.method === "GET") {
    const publicPaths = ["/api/papers", "/api/trends"];
    const isPublic = publicPaths.some((p) => req.path.startsWith(p));
    if (isPublic) {
      res.set("Cache-Control", "public, max-age=60");
    } else {
      res.set("Cache-Control", "private, no-cache");
    }
  } else {
    res.set("Cache-Control", "no-store");
  }
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "Scientific Journal Publication Trend Tracking System API is running" });
});

// ── Health Check ──────────────────────────────────────────────────────────────
app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", database: "connected", timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: "error", database: "disconnected", timestamp: new Date().toISOString() });
  }
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/crawler", crawlerRoutes);
app.use("/api/papers", paperRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/analytics", analyticsRoutes);
app.get("/api/trends", getTrends);

// ── Global Error Handler ──────────────────────────────────────────────────────
// Catches any unhandled errors passed via next(err) — never leaks internals
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

export default app;