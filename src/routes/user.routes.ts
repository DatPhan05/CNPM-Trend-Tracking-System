import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/user.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs for ADMIN
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Get users successfully
 *       401:
 *         description: Access token is required
 *       403:
 *         description: Forbidden
 */
router.get("/", authenticateToken, authorizeRoles("ADMIN"), getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by id
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     responses:
 *       200:
 *         description: Get user successfully
 *       404:
 *         description: User not found
 */
router.get("/:id", authenticateToken, authorizeRoles("ADMIN"), getUserById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Student User
 *               email:
 *                 type: string
 *                 example: student@example.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *               role:
 *                 type: string
 *                 enum: [ADMIN, STUDENT, RESEARCHER]
 *                 example: STUDENT
 *     responses:
 *       201:
 *         description: Create user successfully
 *       400:
 *         description: Missing required fields or invalid role
 *       409:
 *         description: Email already exists
 */
router.post("/", authenticateToken, authorizeRoles("ADMIN"), createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user by id
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Updated Student User
 *               email:
 *                 type: string
 *                 example: updated@example.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *               role:
 *                 type: string
 *                 enum: [ADMIN, STUDENT, RESEARCHER]
 *                 example: RESEARCHER
 *     responses:
 *       200:
 *         description: Update user successfully
 *       400:
 *         description: Invalid role
 *       404:
 *         description: User not found
 */
router.put("/:id", authenticateToken, authorizeRoles("ADMIN"), updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user by id
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     responses:
 *       200:
 *         description: Delete user successfully
 *       404:
 *         description: User not found
 */
router.delete("/:id", authenticateToken, authorizeRoles("ADMIN"), deleteUser);

export default router;