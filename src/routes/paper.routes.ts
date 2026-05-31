import { Router } from "express";
import { getPaperById, getPapers } from "../controllers/paper.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticateToken, getPapers);
router.get("/:id", authenticateToken, getPaperById);

export default router;