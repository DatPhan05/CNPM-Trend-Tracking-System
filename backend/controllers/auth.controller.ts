import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-antigravity";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: "Please enter all fields." });
      return;
    }

    // Check existing
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ success: false, message: "Email is already registered." });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const user = await prisma.user.create({
      data: {
        fullName: name,
        email,
        password: hashedPassword,
        role: role || "STUDENT",
      },
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: {
        user: {
          id: user.id,
          name: user.fullName,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error: any) {
    console.error("❌ Register error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: "Please enter all fields." });
      return;
    }

    // Find User
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ success: false, message: "Invalid email or password." });
      return;
    }

    // Validate Password
    const isMatch = user.password ? await bcrypt.compare(password, user.password) : false;
    if (!isMatch) {
      res.status(400).json({ success: false, message: "Invalid email or password." });
      return;
    }

    // Sign JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      access_token: token,
      refresh_token: token,
      user: {
        id: user.id,
        name: user.fullName,
        email: user.email,
        role: user.role.toLowerCase(),
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error("❌ Login error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
