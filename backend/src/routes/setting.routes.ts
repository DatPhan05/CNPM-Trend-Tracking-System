import { Router } from "express";
import {
  createSetting,
  deleteSetting,
  getSettingByKey,
  getSettings,
  updateSetting,
} from "../controllers/setting.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: System settings management APIs
 */

/**
 * @swagger
 * /api/settings:
 *   get:
 *     summary: Get all system settings
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Get settings successfully
 */
router.get("/", authenticateToken, authorizeRoles("ADMIN"), getSettings);

/**
 * @swagger
 * /api/settings/{key}:
 *   get:
 *     summary: Get system setting by key
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         example: APP_NAME
 *     responses:
 *       200:
 *         description: Get setting successfully
 *       404:
 *         description: Setting not found
 */
router.get("/:key", authenticateToken, authorizeRoles("ADMIN"), getSettingByKey);

/**
 * @swagger
 * /api/settings:
 *   post:
 *     summary: Create system setting
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - key
 *               - value
 *             properties:
 *               key:
 *                 type: string
 *                 example: APP_NAME
 *               value:
 *                 type: string
 *                 example: Trend-Tracking
 *               description:
 *                 type: string
 *                 example: Application display name
 *     responses:
 *       201:
 *         description: Create setting successfully
 *       400:
 *         description: Missing key or value
 *       409:
 *         description: Setting key already exists
 */
router.post("/", authenticateToken, authorizeRoles("ADMIN"), createSetting);

/**
 * @swagger
 * /api/settings/{key}:
 *   put:
 *     summary: Update system setting by key
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         example: APP_NAME
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: string
 *                 example: Trend-Tracking System
 *               description:
 *                 type: string
 *                 example: Updated application name
 *     responses:
 *       200:
 *         description: Update setting successfully
 *       404:
 *         description: Setting not found
 */
router.put("/:key", authenticateToken, authorizeRoles("ADMIN"), updateSetting);

/**
 * @swagger
 * /api/settings/{key}:
 *   delete:
 *     summary: Delete system setting by key
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         example: APP_NAME
 *     responses:
 *       200:
 *         description: Delete setting successfully
 *       404:
 *         description: Setting not found
 */
router.delete("/:key", authenticateToken, authorizeRoles("ADMIN"), deleteSetting);

export default router;