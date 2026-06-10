import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import userRoutes from "./routes/user.routes";
import settingRoutes from "./routes/setting.routes";
import crawlerRoutes from "./routes/crawler.routes";
import paperRoutes from "./routes/paper.routes";
import bookmarkRoutes from "./routes/bookmark.routes";
import { getTrends } from "./controllers/paper.controller";

const app = express();

app.use(cors());
app.use(express.json());

// ── RESTful Constraint #3: Cacheability ──────────────────────────────────────
// Apply Cache-Control headers so clients and proxies can cache safe responses.
// GET /api/papers and /api/trends are public, cacheable for 60 seconds.
// Auth and write endpoints must not be cached.
app.use((req, res, next) => {
  if (req.method === "GET") {
    const publicPaths = ["/api/papers", "/api/trends"];
    const isPublic = publicPaths.some((p) => req.path.startsWith(p));
    if (isPublic) {
      // Cache public read-only resources for 60 seconds
      res.set("Cache-Control", "public, max-age=60");
    } else {
      // Private user data (bookmarks, profile) must not be shared-cached
      res.set("Cache-Control", "private, no-cache");
    }
  } else {
    // POST / PUT / DELETE responses must never be cached
    res.set("Cache-Control", "no-store");
  }
  next();
});

app.get("/", (req, res) => {
  res.json({
    message: "TrendScholar API is running",
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/crawler", crawlerRoutes);
app.use("/api/papers", paperRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.get("/api/trends", getTrends);

export default app;