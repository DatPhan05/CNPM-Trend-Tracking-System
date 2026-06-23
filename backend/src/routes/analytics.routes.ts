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
 *   description: Analytics & Statistics APIs
 */

/**
 * @swagger
 * /api/analytics/overview:
 *   get:
 *     summary: Lấy thống kê tổng quan (số lượng bài báo, tạp chí, tác giả)
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Thống kê tổng quan
 */
router.get('/overview', getOverview);

/**
 * @swagger
 * /api/analytics/trends:
 *   get:
 *     summary: Lấy xu hướng xuất bản theo thời gian
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Dữ liệu biểu đồ xu hướng
 */
router.get('/trends', getTrends);
/**
 * @swagger
 * /api/analytics/categories:
 *   get:
 *     summary: Lấy thống kê theo danh mục/chủ đề
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Dữ liệu phân bổ danh mục
 */
router.get('/categories', getCategories);

/**
 * @swagger
 * /api/analytics/top-authors:
 *   get:
 *     summary: Lấy danh sách các tác giả xuất bản nhiều nhất
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Danh sách tác giả hàng đầu
 */
router.get('/top-authors', getTopAuthors);

/**
 * @swagger
 * /api/analytics/export/csv:
 *   get:
 *     summary: Xuất báo cáo dữ liệu dưới định dạng CSV
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Trả về file CSV
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/export/csv', exportCsv);

/**
 * @swagger
 * /api/analytics/export/pdf:
 *   get:
 *     summary: Xuất báo cáo dữ liệu dưới định dạng PDF
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Trả về file PDF
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/export/pdf', exportPdf);

export default router;
