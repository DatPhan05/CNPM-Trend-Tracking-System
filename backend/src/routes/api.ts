import { Router, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { register, login } from "../controllers/auth.controller";
import { getPapers, getTrends, searchPapers } from "../controllers/paper.controller";
import { getBookmarks, addBookmark, removeBookmark } from "../controllers/bookmark.controller";
import analyticsRoutes from "./analytics.routes";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-antigravity";

const router = Router();

// Middleware to authenticate JWT
const authenticateToken = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ success: false, message: "Access token is missing." });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      res.status(403).json({ success: false, message: "Token is invalid or expired." });
      return;
    }
    req.user = user;
    next();
  });
};

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Đăng ký tài khoản người dùng mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [ADMIN, RESEARCHER, STUDENT]
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Lỗi dữ liệu hoặc email đã tồn tại
 */
router.post("/auth/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Đăng nhập nhận JWT Token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về JWT Token
 *       400:
 *         description: Sai thông tin tài khoản hoặc mật khẩu
 */
router.post("/auth/login", login);

/**
 * @swagger
 * /papers:
 *   get:
 *     summary: Lấy danh sách và tìm kiếm bài báo khoa học
 *     tags: [Papers]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm theo Tiêu đề/Abstract/Từ khóa
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Lọc theo năm xuất bản
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Lọc theo tên tác giả
 *     responses:
 *       200:
 *         description: Danh sách bài viết khoa học
 */
router.get("/papers", getPapers);
router.get("/papers/search", searchPapers);

/**
 * @swagger
 * /trends:
 *   get:
 *     summary: Thống kê số liệu xu hướng nghiên cứu và Top Keywords
 *     tags: [Trends]
 *     responses:
 *       200:
 *         description: Số liệu gộp thống kê xu hướng
 */
router.get("/trends", getTrends);

/**
 * @swagger
 * /bookmarks:
 *   get:
 *     summary: Lấy danh sách bài báo đã bookmark của người dùng
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách bài báo đã lưu
 *       401:
 *         description: Chưa đăng nhập hoặc Token hết hạn
 */
router.get("/bookmarks", authenticateToken, getBookmarks);

/**
 * @swagger
 * /bookmarks:
 *   post:
 *     summary: Đánh dấu lưu bookmark một bài viết
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
 *         description: Đánh dấu thành công
 *       401:
 *         description: Chưa đăng nhập
 */
router.post("/bookmarks", authenticateToken, addBookmark);

/**
 * @swagger
 * /bookmarks/remove:
 *   post:
 *     summary: Xóa một bài báo khỏi danh sách bookmark
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
 *         description: Xóa bookmark thành công
 *       401:
 *         description: Chưa đăng nhập
 */
router.post("/bookmarks/remove", authenticateToken, removeBookmark);

router.use("/analytics", analyticsRoutes);

export default router;
