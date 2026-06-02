import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getPapers = async (req: Request, res: Response) => {
  try {
    const papers = await prisma.paper.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        journal: true,
        authors: {
          include: {
            author: true,
          },
        },
        keywords: {
          include: {
            keyword: true,
          },
        },
      },
    });

    return res.status(200).json({
      message: "Get papers successfully",
      papers,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

export const getPaperById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    const paper = await prisma.paper.findUnique({
      where: { id },
      include: {
        journal: true,
        authors: {
          include: {
            author: true,
          },
        },
        keywords: {
          include: {
            keyword: true,
          },
        },
      },
    });

    if (!paper) {
      return res.status(404).json({
        message: "Paper not found",
      });
    }

    return res.status(200).json({
      message: "Get paper successfully",
      paper,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};