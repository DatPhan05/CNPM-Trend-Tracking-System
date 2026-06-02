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

app.get("/", (req, res) => {
  res.json({
    message: "TrendScholar API is running",
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth/users", userRoutes); // Alias for frontend compatibility
app.use("/api/settings", settingRoutes);
app.use("/api/crawler", crawlerRoutes);
app.use("/api/papers", paperRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.get("/api/trends", getTrends);

export default app;