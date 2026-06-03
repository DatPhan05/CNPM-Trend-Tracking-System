import { Router } from "express";
import { getBookmarks, addBookmark, removeBookmark } from "../controllers/bookmark.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Bookmarks
 *   description: User bookmarks management APIs
 */

/**
 * @swagger
 * /api/bookmarks:
 *   get:
 *     summary: Get all bookmarked papers of logged-in user
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookmarked papers
 */
router.get("/", authenticateToken, getBookmarks);

/**
 * @swagger
 * /api/bookmarks:
 *   post:
 *     summary: Bookmark a scientific paper
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paperId
 *             properties:
 *               paperId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Paper bookmarked successfully
 */
router.post("/", authenticateToken, addBookmark);

/**
 * @swagger
 * /api/bookmarks/remove:
 *   post:
 *     summary: Remove bookmark from a scientific paper
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paperId
 *             properties:
 *               paperId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bookmark removed successfully
 */
router.post("/remove", authenticateToken, removeBookmark);

export default router;
