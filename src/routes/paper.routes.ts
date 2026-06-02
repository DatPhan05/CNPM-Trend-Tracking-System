import { Router } from "express";
import { getPaperById, getPapers } from "../controllers/paper.controller";
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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Get papers successfully
 *       401:
 *         description: Access token is required
 */
router.get("/", authenticateToken, getPapers);

/**
 * @swagger
 * /api/papers/{id}:
 *   get:
 *     summary: Get scientific paper by id
 *     tags: [Papers]
 *     security:
 *       - bearerAuth: []
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
router.get("/:id", authenticateToken, getPaperById);

export default router;