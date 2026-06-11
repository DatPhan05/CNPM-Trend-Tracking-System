import { Response } from "express";
import prisma from "../lib/prisma";

export const getBookmarks = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized." });
      return;
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      include: {
        paper: {
          include: {
            journal: true,
            authors: { include: { author: true } },
            keywords: { include: { keyword: true } },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const mappedPapers = bookmarks.map((b) => ({
      id: b.paper.id,
      title: b.paper.title,
      authors: b.paper.authors.map((pa: any) => pa.author.name),
      year: b.paper.publicationYear || 2026,
      journal: b.paper.journal?.name || "Local Database",
      citations: b.paper.citationCount,
      tags: b.paper.keywords.map((pk: any) => pk.keyword.name),
      abstract: b.paper.abstract || "",
    }));
    
    res.json({ success: true, papers: mappedPapers });
  } catch (error: any) {
    console.error("❌ getBookmarks error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const addBookmark = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || req.user?.userId;
    const { paperId } = req.body;

    if (!userId || !paperId) {
      res.status(400).json({ success: false, message: "Missing user or paper identification." });
      return;
    }

    const bookmark = await prisma.bookmark.upsert({
      where: {
        userId_paperId: { userId, paperId },
      },
      update: {},
      create: { userId, paperId },
    });

    res.status(201).json({ success: true, bookmark });
  } catch (error: any) {
    console.error("❌ addBookmark error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const removeBookmark = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || req.user?.userId;
    // RESTful: paperId comes from URL path param (:paperId), not request body
    const { paperId } = req.params;

    if (!userId || !paperId) {
      res.status(400).json({ success: false, message: "Missing user or paper identification." });
      return;
    }

    await prisma.bookmark.delete({
      where: {
        userId_paperId: { userId, paperId },
      },
    });

    res.json({ success: true, message: "Bookmark removed successfully." });
  } catch (error: any) {
    console.error("❌ removeBookmark error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
