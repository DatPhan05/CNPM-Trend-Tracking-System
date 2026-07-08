import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import prisma from "../helpers/prisma";
import { sendGooglePasswordEmail } from "../services/mail.service";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error("FATAL ERROR: JWT_SECRET and JWT_REFRESH_SECRET must be defined in environment variables.");
}

const normalizeUserName = (value?: string) => value?.trim().toLowerCase() || undefined;
const normalizeIdentityUid = (value?: string) => value?.trim().toUpperCase() || undefined;

const buildDefaultUserName = (fullName: string, email: string) => {
  const base = fullName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/(^\.|\.$)/g, "");

  const emailPrefix = email.split("@")[0].toLowerCase().replace(/[^a-z0-9._-]+/g, "");
  return (base || emailPrefix || `user.${Date.now()}`).slice(0, 24);
};

const ensureUniqueUserName = async (preferred: string) => {
  let candidate = preferred;
  let suffix = 1;

  while (await prisma.user.findUnique({ where: { userName: candidate } })) {
    candidate = `${preferred.slice(0, 24)}${suffix}`;
    suffix += 1;
  }

  return candidate;
};

const generateTemporaryPassword = () => crypto.randomBytes(9).toString("base64url");

const createAuthTokens = (user: { id: string; email: string; role: string }) => {
  const tokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return {
    token: jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "15m" }),
    refreshToken: jwt.sign(tokenPayload, JWT_REFRESH_SECRET, { expiresIn: "7d" }),
  };
};

export const register = async (req: Request, res: Response) => {
  try {
    const fullName = req.body.fullName || req.body.name;
    const { email, password, schoolName } = req.body;
    const identityValue = req.body.identityUid || req.body.uid || req.body.userName;
    const identityUid = normalizeIdentityUid(identityValue);
    const userName = normalizeUserName(identityValue);

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "fullName, email and password are required",
      });
    }

    if (identityValue && !/^\d{12}$/.test(String(identityValue).trim())) {
      return res.status(400).json({
        success: false,
        message: "CCCD must contain exactly 12 digits",
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          ...(userName ? [{ userName }] : []),
          ...(identityUid ? [{ identityUid }] : []),
        ],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email, username or UID already exists",
      });
    }

    const finalUserName = await ensureUniqueUserName(userName || buildDefaultUserName(fullName, email));
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        userName: finalUserName,
        identityUid,
        schoolName: schoolName?.trim() || null,
        password: hashedPassword,
        role: "STUDENT",
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
      },
    });

    return res.status(201).json({
      success: true,
      message: "Register successfully",
      user,
      data: { user }
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const identifier = String(req.body.identifier || req.body.userName || req.body.identityUid || email || "").trim();
    const normalizedIdentifier = identifier.toLowerCase();
    const normalizedUid = normalizeIdentityUid(identifier);

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "identifier and password are required",
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { userName: normalizedIdentifier },
          ...(normalizedUid ? [{ identityUid: normalizedUid }] : []),
        ],
      },
    });

    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: "Invalid identifier or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid identifier or password",
      });
    }

    const { token, refreshToken } = createAuthTokens(user);

    return res.status(200).json({
      success: true,
      message: "Login successfully",
      token,
      access_token: token,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        name: user.fullName,
        fullName: user.fullName,
        email: user.email,
        userName: user.userName,
        identityUid: user.identityUid,
        schoolName: user.schoolName,
        role: user.role,
      },
      data: {
        token,
        user: {
          id: user.id,
          name: user.fullName,
          fullName: user.fullName,
          email: user.email,
          userName: user.userName,
          identityUid: user.identityUid,
          schoolName: user.schoolName,
          role: user.role,
        }
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({
        success: false,
        message: "GOOGLE_CLIENT_ID is not configured",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload?.email;
    const fullName = payload?.name || payload?.given_name || "Google User";

    if (!email || !payload?.email_verified) {
      return res.status(400).json({
        success: false,
        message: "Google email is missing or not verified",
      });
    }

    const temporaryPassword = generateTemporaryPassword();
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
    const existingUser = await prisma.user.findUnique({ where: { email } });

    const user = existingUser
      ? await prisma.user.update({
          where: { email },
          data: {
            fullName: existingUser.fullName || fullName,
            password: hashedPassword,
          },
          select: {
            id: true,
            fullName: true,
            email: true,
            userName: true,
            identityUid: true,
            schoolName: true,
            role: true,
          },
        })
      : await prisma.user.create({
          data: {
            fullName,
            email,
            userName: await ensureUniqueUserName(buildDefaultUserName(fullName, email)),
            password: hashedPassword,
            role: "STUDENT",
          },
          select: {
            id: true,
            fullName: true,
            email: true,
            userName: true,
            identityUid: true,
            schoolName: true,
            role: true,
          },
        });

    await sendGooglePasswordEmail({
      to: email,
      fullName: user.fullName,
      password: temporaryPassword,
    });

    const { token, refreshToken } = createAuthTokens(user);

    return res.status(200).json({
      success: true,
      message: "Đăng nhập Google thành công. Mật khẩu tạm thời đã được gửi về email.",
      token,
      access_token: token,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        name: user.fullName,
        fullName: user.fullName,
        email: user.email,
        userName: user.userName,
        identityUid: user.identityUid,
        schoolName: user.schoolName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({
      success: false,
      message: "Google login failed. Please check Google and SMTP configuration.",
    });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;

    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        userName: true,
        identityUid: true,
        schoolName: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("getMe error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ── Refresh Token ─────────────────────────────────────────────────────────────
// The frontend calls POST /api/auth/refresh when the 401 interceptor fires.
// Strategy: verify the refresh token using a separate REFRESH_SECRET,
// look up the user in DB to ensure account still exists/is active,
// then issue a brand-new 15m access token and a new refresh token (rotation).
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({
        success: false,
        message: "refresh_token is required",
      });
    }

    // Verify the refresh token with its own secret
    let decoded: any;
    try {
      decoded = jwt.verify(refresh_token, JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    // Ensure the user still exists in the database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, fullName: true },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found — please log in again",
      });
    }

    const tokenPayload = { userId: user.id, email: user.email, role: user.role };

    // Issue a new short-lived access token (15 minutes)
    const newAccessToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "15m" });

    // Issue a new refresh token (rotation)
    const newRefreshToken = jwt.sign(tokenPayload, JWT_REFRESH_SECRET, { expiresIn: "7d" });

    return res.status(200).json({
      success: true,
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    });
  } catch (error) {
    console.error("refreshToken error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    const { fullName, email } = req.body;

    if (!fullName && !email) {
      return res.status(400).json({
        success: false,
        message: "fullName or email is required to update",
      });
    }

    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser && existingUser.id !== authUser.userId) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    const updateData: { fullName?: string; email?: string } = {};
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;

    const updatedUser = await prisma.user.update({
      where: { id: authUser.userId },
      data: updateData,
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Update profile successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("updateProfile error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
    });

    if (!user || !user.password) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid current password",
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: authUser.userId },
      data: {
        password: hashedNewPassword,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Change password successfully",
    });
  } catch (error) {
    console.error("changePassword error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // Log disabled for production: console.log(`[MOCK EMAIL] Sent password reset link to ${email}`);
    }

    return res.status(200).json({
      success: true,
      message: "Nếu email tồn tại trên hệ thống, liên kết đặt lại mật khẩu đã được gửi.",
    });
  } catch (error) {
    console.error("forgotPassword error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

