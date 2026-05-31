import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import userRoutes from "./routes/user.routes";
import settingRoutes from "./routes/setting.routes";
import crawlerRoutes from "./routes/crawler.routes";
import paperRoutes from "./routes/paper.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "TrendScholar API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/crawler", crawlerRoutes);
app.use("/api/papers", paperRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});