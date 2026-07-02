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
 *         name: journal
 *         schema:
 *           type: string
 *         description: Filter by journal name, comma separated
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [relevance, newest, citations]
 *         description: Sort order for the result list
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaperListResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalPapers:
 *                       type: integer
 *                       example: 128
 *                     totalJournals:
 *                       type: integer
 *                       example: 12
 *                     totalKeywords:
 *                       type: integer
 *                       example: 32
 *                     totalCitations:
 *                       type: integer
 *                       example: 5200
 *                     trendSeries:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/TrendPoint'
 *                     citationSeries:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           year:
 *                             type: string
 *                             example: "2026"
 *                           citations:
 *                             type: integer
 *                             example: 480
 *                     keywordSeries:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/TopAuthorPoint'
 *                     topAuthors:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/TopAuthorPoint'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaperDetailResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", getPaperById);

export default router;
