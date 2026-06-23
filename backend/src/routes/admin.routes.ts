import { Router } from "express";
import prisma from "../helpers/prisma";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management APIs
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Lấy danh sách toàn bộ người dùng (Chỉ dành cho Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về danh sách người dùng
 *       401:
 *         description: Unauthorized (Không có token)
 *       403:
 *         description: Forbidden (Không phải Admin)
 */
router.get(
  "/users",
  authenticateToken,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      users,
    });
  }
);

export default router;