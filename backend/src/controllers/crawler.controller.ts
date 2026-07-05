import { Request, Response } from "express";
import { crawlerQueue } from "../services/queue.service";

export const crawlOpenAlexPapers = async (req: Request, res: Response) => {
  try {
    const keyword = String(req.query.keyword || "");
    const limit = Number(req.query.limit || 10);

    if (!keyword) {
      return res.status(400).json({
        message: "keyword is required",
      });
    }

    // Đẩy job vào queue thay vì chờ đợi xử lý đồng bộ
    await crawlerQueue.add('crawl', { keyword, limit });

    return res.status(200).json({
      message: "Đã đưa yêu cầu thu thập dữ liệu vào hàng đợi xử lý ngầm",
      keyword,
      limit,
    });
  } catch (error) {
    console.error("crawlOpenAlexPapers error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};