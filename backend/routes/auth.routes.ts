import { Router } from "express";
import { getMe, login, register, refreshToken, updateProfile, changePassword, forgotPassword } from "../controllers/auth.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { loginSchema, refreshTokenSchema, registerSchema, updateProfileSchema, changePasswordSchema, forgotPasswordSchema } from "../schemas/validation.schemas";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
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
 *                 example: Admin User
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *               role:
 *                 type: string
 *                 enum: [ADMIN, STUDENT, RESEARCHER]
 *                 example: ADMIN
 *     responses:
 *       201:
 *         description: Register successfully
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Email already exists
 */
router.post("/register", validateBody(registerSchema), register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
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
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login successfully
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", validateBody(loginSchema), login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current logged-in user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user information
 *       401:
 *         description: Access token is required
 *       403:
 *         description: Invalid or expired token
 */
router.get("/me", authenticateToken, getMe);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refresh_token
 *             properties:
 *               refresh_token:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access_token and refresh_token returned
 *       400:
 *         description: refresh_token is required
 *       401:
 *         description: Invalid or tampered token
 */
router.post("/refresh", validateBody(refreshTokenSchema), refreshToken);

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Update current logged-in user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: New Full Name
 *               email:
 *                 type: string
 *                 example: newemail@example.com
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid body or missing fields
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Email already in use
 */
router.put("/profile", authenticateToken, validateBody(updateProfileSchema), updateProfile);

/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     summary: Change current logged-in user password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid body or missing fields
 *       401:
 *         description: Invalid current password or unauthorized
 */
router.put("/change-password", authenticateToken, validateBody(changePasswordSchema), changePassword);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset link
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: If email exists, reset link sent
 */
router.post("/forgot-password", validateBody(forgotPasswordSchema), forgotPassword);

export default router;