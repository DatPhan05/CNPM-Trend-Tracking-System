import { Router } from "express";
import { getPaperById, getPapers, getTrends, searchPapers } from "../controllers/paper.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Papers
 *   description: Scientific papers APIs
 */

/**
 * @swagger
 * /api/papers:
 *   get:
 *     summary: Get all scientific papers
 *     tags: [Papers]
 *     responses:
 *       200:
 *         description: Get papers successfully
 */
router.get("/", getPapers);

/**
 * @swagger
 * /api/papers/search:
 *   get:
 *     summary: Search scientific papers
 *     tags: [Papers]
 *     responses:
 *       200:
 *         description: Search papers successfully
 */
router.get("/search", searchPapers);

/**
 * @swagger
 * /api/papers/trends:
 *   get:
 *     summary: Get search trends
 *     tags: [Papers]
 *     responses:
 *       200:
 *         description: Get trends successfully
 */
router.get("/trends", getTrends);

/**
 * @swagger
 * /api/papers/{id}:
 *   get:
 *     summary: Get scientific paper by id
 *     tags: [Papers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Paper id
 *     responses:
 *       200:
 *         description: Get paper successfully
 *       404:
 *         description: Paper not found
 */
router.get("/:id", getPaperById);

export default router;