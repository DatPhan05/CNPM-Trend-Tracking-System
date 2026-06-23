import { Router } from "express";
import prisma from "../helpers/prisma";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

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