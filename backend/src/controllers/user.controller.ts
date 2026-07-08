import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { UserRole } from "@prisma/client";
import prisma from "../helpers/prisma";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        userName: true,
        identityUid: true,
        schoolName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      message: "Get users successfully",
      users,
      count: users.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        userName: true,
        identityUid: true,
        schoolName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Get user successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, role, userName, identityUid, schoolName } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "fullName, email and password are required",
      });
    }

    if (role && !Object.values(UserRole).includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const identityValue = identityUid || userName;
    const normalizedUserName = identityValue?.trim().toLowerCase();
    const normalizedIdentityUid = identityValue?.trim().toUpperCase();
    const isAdminShortcut = role === UserRole.ADMIN && identityValue?.trim().toLowerCase() === "admin";

    if (identityValue && !/^\d{12}$/.test(identityValue.trim()) && !isAdminShortcut) {
      return res.status(400).json({
        message: "CCCD must contain exactly 12 digits",
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          ...(normalizedUserName ? [{ userName: normalizedUserName }] : []),
          ...(normalizedIdentityUid ? [{ identityUid: normalizedIdentityUid }] : []),
        ],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email, username or UID already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        userName: normalizedUserName,
        identityUid: isAdminShortcut ? null : normalizedIdentityUid,
        schoolName: schoolName?.trim() || null,
        password: hashedPassword,
        role: role || UserRole.STUDENT,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        userName: true,
        identityUid: true,
        schoolName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(201).json({
      message: "Create user successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { fullName, email, password, role, userName, identityUid, schoolName } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (role && !Object.values(UserRole).includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const updateData: {
      fullName?: string;
      email?: string;
      userName?: string | null;
      identityUid?: string | null;
      schoolName?: string | null;
      password?: string;
      role?: UserRole;
    } = {};

    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;
    if (userName !== undefined || identityUid !== undefined) {
      const identityValue = identityUid || userName;
      const effectiveRole = role || existingUser.role;
      const isAdminShortcut = effectiveRole === UserRole.ADMIN && identityValue?.trim().toLowerCase() === "admin";

      if (identityValue && !/^\d{12}$/.test(identityValue.trim()) && !isAdminShortcut) {
        return res.status(400).json({
          message: "CCCD must contain exactly 12 digits",
        });
      }
      updateData.userName = identityValue ? identityValue.trim().toLowerCase() : null;
      updateData.identityUid = identityValue && !isAdminShortcut ? identityValue.trim().toUpperCase() : null;
    }
    if (schoolName !== undefined) updateData.schoolName = schoolName ? schoolName.trim() : null;
    if (role) updateData.role = role;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        fullName: true,
        email: true,
        userName: true,
        identityUid: true,
        schoolName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      message: "Update user successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await prisma.user.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Delete user successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};
