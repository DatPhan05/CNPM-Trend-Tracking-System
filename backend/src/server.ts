import dotenv from "dotenv";
import app from "./app";

import { initElasticsearch } from "./services/elasticsearch.service";
import { initWorker } from "./services/queue.service";

dotenv.config();

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  
  // Khởi tạo các service nền
  await initElasticsearch();
  initWorker();
});