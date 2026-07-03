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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookmarkListResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 bookmark:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: bookmark-001
 *                     userId:
 *                       type: string
 *                       example: user-001
 *                     paperId:
 *                       type: string
 *                       example: paper-001
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", authenticateToken, addBookmark);

/**
 * @swagger
 * /api/bookmarks/{paperId}:
 *   delete:
 *     summary: Remove bookmark from a scientific paper
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paperId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the paper to un-bookmark
 *     responses:
 *       200:
 *         description: Bookmark removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:paperId", authenticateToken, removeBookmark);

export default router;
