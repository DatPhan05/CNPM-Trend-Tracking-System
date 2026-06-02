import express from "express";
import cors from "cors";
import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.config";
import apiRouter from "./routes/api";
import { scrapeScientificPapers } from "./services/scraper";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// 1. Mount Swagger API Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 2. Main API Router
app.use("/api", apiRouter);

// 3. Live Trigger Scraper Scraper Endpoint
app.post("/api/scrape", async (req, res) => {
  try {
    const importedCount = await scrapeScientificPapers();
    res.json({
      success: true,
      message: `Scraper executed successfully. Imported ${importedCount} new papers.`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. Default home check
app.get("/", (req, res) => {
  res.send("🚀 Scientific Journal Publication Trend Tracking API is running! Access Swagger Docs at /api-docs.");
});

// Start Server
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🚀 Server is listening at http://localhost:${PORT}`);
    console.log(`📖 Swagger API Docs are available at http://localhost:${PORT}/api-docs`);
  });
}

export default app;
