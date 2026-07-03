import { Router } from 'express';
import {
  getOverview,
  getTrends,
  getCategories,
  getTopAuthors,
  exportCsv,
  exportPdf
} from '../controllers/analytics.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Aggregated analytics, charts, and report exports
 */

/**
 * @swagger
 * /api/analytics/overview:
 *   get:
 *     summary: Get dashboard overview metrics
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Overview metrics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnalyticsOverviewResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/overview', getOverview);

/**
 * @swagger
 * /api/analytics/trends:
 *   get:
 *     summary: Get trend metrics
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Trend series and citation statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TrendPoint'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/trends', getTrends);

/**
 * @swagger
 * /api/analytics/categories:
 *   get:
 *     summary: Get category breakdown
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Category statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CategoryPoint'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/categories', getCategories);

/**
 * @swagger
 * /api/analytics/top-authors:
 *   get:
 *     summary: Get top authors
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Top authors list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TopAuthorPoint'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/top-authors', getTopAuthors);

/**
 * @swagger
 * /api/analytics/export/csv:
 *   get:
 *     summary: Export analytics as CSV
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: CSV file download
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               example: "Title,Year,Citations,Journal\nAttention Is All You Need,2017,4500,NIPS"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/export/csv', exportCsv);

/**
 * @swagger
 * /api/analytics/export/pdf:
 *   get:
 *     summary: Export analytics as PDF
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: PDF file download
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/export/pdf', exportPdf);

export default router;
