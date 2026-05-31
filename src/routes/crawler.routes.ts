import { Router } from "express";
import { crawlOpenAlexPapers } from "../controllers/crawler.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

router.get(
  "/openalex",
  authenticateToken,
  authorizeRoles("ADMIN"),
  crawlOpenAlexPapers
);

export default router;