import { Router } from "express";
import { crawlOpenAlexPapers } from "../controllers/crawler.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Crawler
 *   description: APIs for crawling scientific papers
 */

/**
 * @swagger
 * /api/crawler/openalex:
 *   get:
 *     summary: Crawl scientific papers from OpenAlex
 *     tags: [Crawler]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         example: machine learning
 *         description: Search keyword for crawling papers
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: number
 *         example: 5
 *         description: Number of papers to fetch
 *     responses:
 *       200:
 *         description: Crawl OpenAlex papers successfully
 *       400:
 *         description: Keyword is required
 *       401:
 *         description: Access token is required
 *       403:
 *         description: Forbidden
 */
router.get(
  "/openalex",
  authenticateToken,
  authorizeRoles("ADMIN"),
  crawlOpenAlexPapers
);

export default router;