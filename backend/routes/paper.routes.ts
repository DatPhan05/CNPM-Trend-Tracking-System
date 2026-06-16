import { Router } from "express";
import { getPaperById, getPapers, getTrends, searchPapers } from "../controllers/paper.controller";

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
 *     summary: Get / search scientific papers
 *     description: |
 *       RESTful unified endpoint for listing and searching papers.
 *       Supports two modes via the `mode` query parameter:
 *       - `local` (default): searches the internal PostgreSQL database
 *       - `openalex`: searches the OpenAlex external API in real-time
 *     tags: [Papers]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Keyword to search in title, abstract, or keywords (local mode)
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter by publication year (local mode)
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter by author name (local mode)
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Keyword for OpenAlex search (openalex mode)
 *       - in: query
 *         name: mode
 *         schema:
 *           type: string
 *           enum: [local, openalex]
 *           default: local
 *         description: Data source mode
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of papers matching the query with pagination metadata
 */
router.get("/", (req, res) => {
  // RESTful: single GET /papers endpoint handles both listing and searching
  // via query parameters instead of a separate /papers/search sub-resource
  const mode = req.query.mode as string;
  if (mode === "openalex") {
    // Delegate to searchPapers which handles the OpenAlex API call
    return searchPapers(req, res);
  }
  // Default: search/list from local database
  return getPapers(req, res);
});

/**
 * @swagger
 * /api/papers/trends:
 *   get:
 *     summary: Get research trend, citation, and keyword chart data
 *     tags: [Papers]
 *     responses:
 *       200:
 *         description: Aggregated chart-ready statistics for trends, citations, keywords, and authors
 */
router.get("/trends", getTrends);

/**
 * @swagger
 * /api/papers/{id}:
 *   get:
 *     summary: Get a scientific paper by ID
 *     tags: [Papers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID of the paper
 *     responses:
 *       200:
 *         description: Paper found
 *       404:
 *         description: Paper not found
 */
router.get("/:id", getPaperById);

/**
 * @swagger
 * /api/papers/{id}:
 *   get:
 *     summary: Get a scientific paper by ID
 *     tags: [Papers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID of the paper
 *     responses:
 *       200:
 *         description: Paper found
 *       404:
 *         description: Paper not found
 */
router.get("/:id", getPaperById);

export default router;