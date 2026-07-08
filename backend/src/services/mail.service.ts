import nodemailer from "nodemailer";

type SendPasswordEmailInput = {
  to: string;
  fullName: string;
  password: string;
};

const requiredMailEnv = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"] as const;

export const isMailConfigured = () => requiredMailEnv.every((key) => Boolean(process.env[key]));

const getTransporter = () => {
  if (!isMailConfigured()) {
    throw new Error("SMTP is not configured");
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendGooglePasswordEmail = async ({ to, fullName, password }: SendPasswordEmailInput) => {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from,
    to,
    subject: "Trend Tracking System - Mat khau dang nhap",
    text: [
      `Xin chao ${fullName},`,
      "",
      "Tai khoan cua ban da duoc tao/cap nhat tu dang nhap Google.",
      `Email dang nhap: ${to}`,
      `Mat khau tam thoi: ${password}`,
      "",
      "Vui long dang nhap va doi mat khau sau khi su dung.",
      "Trend Tracking System",
    ].join("\n"),
  });
};
