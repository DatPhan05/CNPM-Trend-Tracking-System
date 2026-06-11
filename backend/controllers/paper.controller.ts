import { Request, Response } from "express";
import prisma from "../lib/prisma";
import axios from "axios";

// Helper function to reconstruct OpenAlex abstract
function reconstructAbstract(invertedIndex: any): string {
  if (!invertedIndex) return "";
  const words: string[] = [];
  try {
    for (const word of Object.keys(invertedIndex)) {
      const positions = invertedIndex[word];
      for (const pos of positions) {
        words[pos] = word;
      }
    }
  } catch (e) {
    return "";
  }
  return words.filter(Boolean).join(" ");
}

export const getPapers = async (req: Request, res: Response): Promise<void> => {
  try {
    const keyword = (req.query.keyword as string) || (req.query.query as string) || "";
    const yearParam = req.query.year as string;
    const authorParam = req.query.author as string;
    
    // Pagination parameters
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const skip = (page - 1) * limit;

    const whereClause: any = {};

    // 1. Text Search across Title and Abstract
    if (keyword) {
      whereClause.OR = [
        { title: { contains: keyword, mode: "insensitive" } },
        { abstract: { contains: keyword, mode: "insensitive" } },
        {
          keywords: {
            some: {
              keyword: {
                name: { contains: keyword, mode: "insensitive" },
              },
            },
          },
        },
      ];
    }

    // 2. Year Filter
    if (yearParam) {
      const year = parseInt(yearParam, 10);
      if (!isNaN(year)) {
        whereClause.publicationYear = year;
      }
    }

    // 3. Author Name Filter
    if (authorParam) {
      whereClause.authors = {
        some: {
          author: {
            name: { contains: authorParam, mode: "insensitive" },
          },
        },
      };
    }

    // 4. Fetch from database with pagination
    const [total, papers] = await prisma.$transaction([
      prisma.paper.count({ where: whereClause }),
      prisma.paper.findMany({
        where: whereClause,
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
        orderBy: {
          citationCount: "desc",
        },
        skip,
        take: limit,
      })
    ]);

    const mappedPapers = papers.map((p) => ({
      id: p.id,
      title: p.title,
      authors: p.authors.map((pa) => pa.author.name),
      year: p.publicationYear || 2026,
      journal: p.journal?.name || "Local Database",
      citations: p.citationCount,
      tags: p.keywords.map((pk) => pk.keyword.name),
      abstract: p.abstract || "",
    }));

    const totalPages = Math.ceil(total / limit);

    res.json({ 
      success: true, 
      message: "Get papers successfully", 
      data: mappedPapers,
      meta: {
        total,
        page,
        limit,
        totalPages
      }
    });
  } catch (error: any) {
    console.error("❌ getPapers error:", error);
    res.status(500).json({ success: false, message: error.message });
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
    console.error("getPaperById error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getTrends = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalPapers = await prisma.paper.count();
    const totalJournals = await prisma.journal.count();
    const totalKeywords = await prisma.keyword.count();

    const citationAgg = await prisma.paper.aggregate({
      _sum: {
        citationCount: true,
      },
    });
    const totalCitations = citationAgg._sum.citationCount || 0;

    const keywordsWithCounts = await prisma.keyword.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: { papers: true },
        },
      },
      orderBy: {
        papers: {
          _count: "desc",
        },
      },
      take: 6,
    });

    const topKeywords = keywordsWithCounts.map((k) => ({
      id: k.id,
      name: k.name,
      count: k._count.papers,
    }));

    res.json({
      success: true,
      stats: {
        totalPapers,
        totalJournals,
        totalKeywords,
        totalCitations,
        topKeywords,
      },
    });
  } catch (error: any) {
    console.error("❌ getTrends error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const searchPapers = async (req: Request, res: Response): Promise<void> => {
  try {
    const keyword = (req.query.keyword as string) || (req.query.query as string) || "";
    // Note: OpenAlex API pagination
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    console.log(`🔍 Searching OpenAlex for keyword: "${keyword}"`);
    const openAlexUrl = `https://api.openalex.org/works?search=${encodeURIComponent(keyword)}&page=${page}&per-page=${limit}`;
    const response = await axios.get(openAlexUrl, {
      headers: { "User-Agent": "ScientificJournalTrendTracker/1.0 (mailto:admin@trendtracking.com)" }
    });

    const works = response.data.results || [];
    const total = response.data.meta?.count || 0;
    const totalPages = Math.ceil(total / limit);

    const mappedPapers = works.map((work: any) => ({
      id: work.id,
      title: work.title || "Untitled",
      authors: work.authorships?.map((a: any) => a.author?.display_name).filter(Boolean) || [],
      year: work.publication_year || 2026,
      journal: work.primary_location?.source?.display_name || "Open Access",
      citations: work.cited_by_count || 0,
      tags: work.concepts?.slice(0, 3).map((c: any) => c.display_name) || ["Research"],
      abstract: reconstructAbstract(work.abstract_inverted_index) || work.description || ""
    }));

    res.json({ 
      success: true, 
      data: mappedPapers,
      meta: {
        total,
        page,
        limit,
        totalPages
      } 
    });
  } catch (error: any) {
    console.error("❌ searchPapers error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};